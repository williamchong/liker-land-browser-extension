import { browser } from 'webextension-polyfill-ts';
import * as api from '../utils/api/likerland';

let bookmarks = new Set<string>();

export async function recoverLocalBookmark() {
  const result = await browser.storage.local.get(['bookmarks']);
  if (result.bookmarks) bookmarks = result.bookmarks;
}

export async function refreshBookmark() {
  const newBookmarks = await api.refreshBookmarkList();
  bookmarks = new Set<string>(
    newBookmarks.map(url => {
      return encodeURIComponent(url);
    })
  );
  browser.storage.local.set({ bookmarks });
}

export async function addBookmark(url: string) {
  await api.addBookmark(url);
  bookmarks.add(encodeURIComponent(url));
  browser.storage.local.set({ bookmarks });
}

export async function removeBookmark(url: string) {
  await api.removeBookmark(url);
  bookmarks.delete(encodeURIComponent(url));
  browser.storage.local.set({ bookmarks });
}

export function isBookmarked(url: string): boolean {
  return bookmarks.has(encodeURIComponent(url));
}

recoverLocalBookmark();
