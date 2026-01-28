#!/usr/bin/env python3
"""
News Scraper Script
Scrapes news from various Italian funding and institutional websites
and stores them in the database.
"""

import os
import sys
from datetime import datetime, timedelta
import requests
from bs4 import BeautifulSoup
import mysql.connector
from urllib.parse import urljoin
import logging

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# News sources configuration
NEWS_SOURCES = [
    # Fondi Interprofessionali
    {"category": "Fondi Interprofessionali", "entity": "Fondimpresa", "url": "https://www.fondimpresa.it/comunicazione/news", "selector": "article"},
    {"category": "Fondi Interprofessionali", "entity": "Fondirigenti", "url": "https://www.fondirigenti.it/news-eventi", "selector": ".news-item"},
    {"category": "Fondi Interprofessionali", "entity": "For.Te.", "url": "https://www.fondoforte.it/news/", "selector": ".news-post"},
    {"category": "Fondi Interprofessionali", "entity": "FonARCom", "url": "https://www.fonarcom.it/comunicazione-news/", "selector": ".news"},
    {"category": "Fondi Interprofessionali", "entity": "Fonter", "url": "https://www.fonter.it/news/", "selector": ".post"},
    {"category": "Fondi Interprofessionali", "entity": "Fondoprofessioni", "url": "https://www.fondoprofessioni.it/notizie-stampa/news/", "selector": ".news-item"},
    {"category": "Fondi Interprofessionali", "entity": "Fon.Coop", "url": "https://www.foncoop.coop/notizie/news/", "selector": ".news"},
    
    # Istituzioni
    {"category": "Istituzioni", "entity": "Invitalia", "url": "https://www.invitalia.it/chi-siamo/area-media/notizie", "selector": ".news-item"},
    {"category": "Istituzioni", "entity": "Incentivi.gov.it", "url": "https://www.incentivi.gov.it/it/news", "selector": ".news"},
    {"category": "Istituzioni", "entity": "SIMEST", "url": "https://www.simest.it/sala-stampa/comunicati-stampa/", "selector": ".press-release"},
    {"category": "Istituzioni", "entity": "MIMIT", "url": "https://www.mimit.gov.it/it/notizie-stampa", "selector": ".news"},
    {"category": "Istituzioni", "entity": "Anpal (FSE+)", "url": "https://www.anpal.gov.it/notizie", "selector": ".news-item"},
    
    # Regioni
    {"category": "Regioni", "entity": "Regione Sicilia", "url": "https://pti.regione.sicilia.it/portal/page/portal/PIR_PORTALE/PIR_LaStrutturaRegionale/PIR_AssessoratoIstruzioneFormazioneProfessionale/PIR_Infoedocumenti/PIR_Avvisiecomunicati", "selector": ".news"},
    {"category": "Regioni", "entity": "Regione Toscana", "url": "https://www.regione.toscana.it/istruzione-formazione-e-lavoro/news", "selector": ".news-item"},
    {"category": "Regioni", "entity": "Regione Lombardia", "url": "https://www.bandi.regione.lombardia.it/servizi/notizie", "selector": ".news"},
    {"category": "Regioni", "entity": "Regione Lazio", "url": "https://www.regione.lazio.it/cittadini/formazione/news", "selector": ".news-item"},
    {"category": "Regioni", "entity": "Regione Emilia-Romagna", "url": "https://formazionelavoro.regione.emilia-romagna.it/notizie", "selector": ".news"},
]

def get_db_connection():
    """Create and return a database connection."""
    try:
        connection = mysql.connector.connect(
            host=os.getenv('DB_HOST', 'localhost'),
            user=os.getenv('DB_USER', 'root'),
            password=os.getenv('DB_PASSWORD', ''),
            database=os.getenv('DB_NAME', 'mannarella'),
            port=int(os.getenv('DB_PORT', 3306))
        )
        return connection
    except mysql.connector.Error as err:
        logger.error(f"Database connection error: {err}")
        return None

def scrape_news_from_source(source):
    """Scrape news from a single source."""
    try:
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
        response = requests.get(source['url'], headers=headers, timeout=10)
        response.raise_for_status()
        
        soup = BeautifulSoup(response.content, 'html.parser')
        news_items = soup.select(source['selector'])[:3]  # Get only top 3
        
        scraped_news = []
        for item in news_items:
            try:
                # Try to extract title
                title_elem = item.find(['h2', 'h3', 'h4', 'a', '.title'])
                title = title_elem.get_text(strip=True) if title_elem else None
                
                # Try to extract link
                link_elem = item.find('a')
                link = link_elem.get('href', '') if link_elem else ''
                if link and not link.startswith('http'):
                    link = urljoin(source['url'], link)
                
                # Try to extract description
                desc_elem = item.find(['p', '.description', '.excerpt'])
                description = desc_elem.get_text(strip=True) if desc_elem else None
                
                # Try to extract date
                date_elem = item.find(['time', '.date', '.published'])
                published_at = datetime.now()  # Default to now
                
                if title and link:
                    scraped_news.append({
                        'title': title[:500],
                        'description': description[:1000] if description else None,
                        'link': link[:512],
                        'published_at': published_at,
                        'category': source['category'],
                        'entity': source['entity'],
                        'source_url': source['url']
                    })
            except Exception as e:
                logger.warning(f"Error parsing news item from {source['entity']}: {e}")
                continue
        
        return scraped_news
    except Exception as e:
        logger.error(f"Error scraping {source['entity']} from {source['url']}: {e}")
        return []

def save_news_to_db(news_list, connection):
    """Save scraped news to the database."""
    if not connection:
        logger.error("No database connection available")
        return 0
    
    cursor = connection.cursor()
    saved_count = 0
    
    try:
        for news in news_list:
            # Check if news already exists
            check_query = """
                SELECT id FROM news 
                WHERE link = %s AND entity = %s
                LIMIT 1
            """
            cursor.execute(check_query, (news['link'], news['entity']))
            
            if cursor.fetchone() is None:
                # Insert new news
                insert_query = """
                    INSERT INTO news 
                    (category, entity, title, description, link, sourceUrl, publishedAt, scrapedAt)
                    VALUES (%s, %s, %s, %s, %s, %s, %s, NOW())
                """
                cursor.execute(insert_query, (
                    news['category'],
                    news['entity'],
                    news['title'],
                    news['description'],
                    news['link'],
                    news['source_url'],
                    news['published_at']
                ))
                saved_count += 1
        
        connection.commit()
        logger.info(f"Saved {saved_count} new news items to database")
        return saved_count
    except mysql.connector.Error as err:
        logger.error(f"Database error: {err}")
        connection.rollback()
        return 0
    finally:
        cursor.close()

def main():
    """Main scraper function."""
    logger.info("Starting news scraper...")
    
    # Connect to database
    connection = get_db_connection()
    if not connection:
        logger.error("Failed to connect to database")
        sys.exit(1)
    
    all_news = []
    total_scraped = 0
    
    # Scrape each source
    for source in NEWS_SOURCES:
        logger.info(f"Scraping {source['entity']} from {source['url']}")
        news = scrape_news_from_source(source)
        all_news.extend(news)
        total_scraped += len(news)
        logger.info(f"Found {len(news)} news items from {source['entity']}")
    
    # Save to database
    saved = save_news_to_db(all_news, connection)
    
    connection.close()
    logger.info(f"Scraper completed. Total scraped: {total_scraped}, Saved: {saved}")

if __name__ == "__main__":
    main()
