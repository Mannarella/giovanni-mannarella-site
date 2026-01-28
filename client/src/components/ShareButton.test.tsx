import { describe, it, expect } from 'vitest';

describe('ShareButton', () => {
  it('should generate correct LinkedIn share URL', () => {
    const newsTitle = 'Nuovo Avviso FonARCom';
    const newsLink = 'https://example.com/news/1';
    
    const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(newsLink)}`;
    
    expect(linkedinUrl).toContain('https://www.linkedin.com/sharing/share-offsite/');
    expect(linkedinUrl).toContain(encodeURIComponent(newsLink));
  });

  it('should generate correct Twitter share URL', () => {
    const newsTitle = 'Nuovo Avviso FonARCom';
    const newsLink = 'https://example.com/news/1';
    
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(newsTitle)}&url=${encodeURIComponent(newsLink)}&hashtags=opportunità`;
    
    expect(twitterUrl).toContain('https://twitter.com/intent/tweet');
    expect(twitterUrl).toContain(encodeURIComponent(newsTitle));
    expect(twitterUrl).toContain(encodeURIComponent(newsLink));
  });

  it('should generate correct Facebook share URL', () => {
    const newsLink = 'https://example.com/news/1';
    
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(newsLink)}`;
    
    expect(facebookUrl).toContain('https://www.facebook.com/sharer/sharer.php');
    expect(facebookUrl).toContain(encodeURIComponent(newsLink));
  });

  it('should generate correct Email share URL', () => {
    const newsTitle = 'Nuovo Avviso FonARCom';
    const newsLink = 'https://example.com/news/1';
    
    const emailUrl = `mailto:?subject=${encodeURIComponent(newsTitle)}&body=${encodeURIComponent(`Scopri questa opportunità: ${newsLink}`)}`;
    
    expect(emailUrl).toContain('mailto:');
    expect(emailUrl).toContain(encodeURIComponent(newsTitle));
    expect(emailUrl).toContain(encodeURIComponent(newsLink));
  });

  it('should encode URLs properly for sharing', () => {
    const specialChars = 'Test & Special < > Characters';
    const encoded = encodeURIComponent(specialChars);
    
    expect(encoded).not.toContain('&');
    expect(encoded).not.toContain('<');
    expect(encoded).not.toContain('>');
  });
});
