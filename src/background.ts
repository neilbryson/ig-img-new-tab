const MENU_ITEM_ID = 'ig-img-new-tab';

browser.menus.create({
  id: MENU_ITEM_ID,
  title: 'Open IG image in new tab',
  contexts: ['page'],
  documentUrlPatterns:  ['*://*.instagram.com/*', '*://instagram.com/*']
});

async function clickedElementListener(info: browser.menus.OnClickData, tab?: browser.tabs.Tab): Promise<void> {
  if (info.menuItemId !== MENU_ITEM_ID) return;
  if (!info.pageUrl?.includes('instagram')) return;
  if (typeof tab?.id === 'number' && typeof info.targetElementId === 'number') {
    // Send the clicked element to the content script, as we cannot access the DOM from here
    await browser.tabs.sendMessage(tab.id, { type: 'ig-img-element', payload: info.targetElementId });
  }
}

async function imageLinkMessageListener(message: Record<string, unknown>): Promise<void> {
  if (message.type === 'ig-img-link' && typeof message.payload === 'string') {
    await browser.tabs.create({ url: message.payload })
  }
}

browser.menus.onClicked.addListener(clickedElementListener);
browser.runtime.onMessage.addListener(imageLinkMessageListener);
