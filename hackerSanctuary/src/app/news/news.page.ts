import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonCol,
  IonGrid,
  IonRow,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonButton,
  IonSpinner,
  IonRefresher,
  IonRefresherContent,
} from '@ionic/angular';

export interface NewsItem {
  title: string;
  link: string;
  pubDate: string;
  contentSnippet: string;
  content?: string;
}

const CACHE_KEY = 'hacker_news_cache_v1';

@Component({
  selector: 'app-news',
  templateUrl: './news.page.html',
  styleUrls: ['./news.page.scss'],
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
    IonCol,
    IonGrid,
    IonRow,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardSubtitle,
    IonCardTitle,
    IonButton,
    IonSpinner,
    IonRefresher,
    IonRefresherContent,
  ],
})
export class NewsPage implements OnInit {
  newsList: NewsItem[] = [];
  isLoading = false;
  errorMessage = '';

  private readonly targetUrl = 'https://feeds.feedburner.com/TheHackersNews';

  constructor() {}

  ngOnInit(): void {
    // 1. Instant load from local cache (0ms perceived load time!)
    this.loadFromCache();

    // 2. Refresh with latest news in background
    this.getRss();
  }

  private loadFromCache(): void {
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        this.newsList = JSON.parse(cached);
      }
    } catch (e) {
      console.warn('Could not read cache:', e);
    }
  }

  private saveToCache(items: NewsItem[]): void {
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify(items));
    } catch (e) {
      console.warn('Could not write cache:', e);
    }
  }

  async getRss(event?: any): Promise<void> {
    // Only show full-screen spinner if we have no cached news to display
    if (this.newsList.length === 0 && !event) {
      this.isLoading = true;
    }
    this.errorMessage = '';

    // Fast proxies first (corsproxy.io is typically 3x-5x faster than allorigins)
    const proxies = [
      `https://corsproxy.io/?url=${encodeURIComponent(this.targetUrl)}`,
      `https://api.allorigins.win/raw?url=${encodeURIComponent(this.targetUrl)}`,
    ];

    let xmlText = '';

    for (const proxyUrl of proxies) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 6000);

        const response = await fetch(proxyUrl, { signal: controller.signal });
        clearTimeout(timeoutId);

        if (response.ok) {
          const text = await response.text();
          if (text && text.trim().length > 0) {
            xmlText = text;
            break;
          }
        }
      } catch (err) {
        console.warn(`Proxy ${proxyUrl} failed or timed out:`, err);
      }
    }

    if (!xmlText) {
      this.isLoading = false;
      if (this.newsList.length === 0) {
        this.errorMessage = 'Could not load news feed. Tap Retry to try again.';
      }
      if (event) {
        event.target.complete();
      }
      return;
    }

    try {
      const domParser = new DOMParser();
      const xmlDoc = domParser.parseFromString(xmlText, 'text/xml');

      let items = Array.from(xmlDoc.getElementsByTagName('item'));
      if (items.length === 0) {
        items = Array.from(xmlDoc.getElementsByTagName('entry'));
      }

      const parsedItems = items.map((el) => {
        const title =
          el.getElementsByTagName('title')[0]?.textContent?.trim() || 'No Title';

        const linkEl = el.getElementsByTagName('link')[0];
        const link =
          linkEl?.getAttribute('href') ||
          linkEl?.textContent?.trim() ||
          '';

        const pubDate = (
          el.getElementsByTagName('pubDate')[0]?.textContent ||
          el.getElementsByTagName('published')[0]?.textContent ||
          el.getElementsByTagName('updated')[0]?.textContent ||
          ''
        ).trim();

        const rawDescription = (
          el.getElementsByTagName('description')[0]?.textContent ||
          el.getElementsByTagName('summary')[0]?.textContent ||
          el.getElementsByTagName('content')[0]?.textContent ||
          ''
        ).trim();

        const contentSnippet = rawDescription
          ? rawDescription
              .replace(/<[^>]*>/g, '')
              .replace(/&nbsp;/g, ' ')
              .replace(/\s+/g, ' ')
              .trim()
              .substring(0, 160) + '...'
          : 'No summary available.';

        return {
          title,
          link,
          pubDate,
          contentSnippet,
          content: rawDescription,
        };
      });

      if (parsedItems.length > 0) {
        this.newsList = parsedItems;
        this.saveToCache(parsedItems);
      }
    } catch (parseErr) {
      console.error('Error parsing RSS XML:', parseErr);
      if (this.newsList.length === 0) {
        this.errorMessage = 'Failed to parse news articles. Please try again.';
      }
    } finally {
      this.isLoading = false;
      if (event) {
        event.target.complete();
      }
    }
  }
}
