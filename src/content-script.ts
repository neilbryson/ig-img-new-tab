(() => {
  async function findImageLink(element: Element | void): Promise<void> {
    if (!(element instanceof HTMLElement)) {
      return;
    }

    const MESSAGE_ID = 'ig-img-link';

    if (element.previousSibling instanceof HTMLElement && element.previousSibling.firstChild instanceof HTMLImageElement) {
      await browser.runtime.sendMessage({ type: MESSAGE_ID, payload: element.previousSibling.firstChild.src });
      return;
    }

    if (element.nextSibling instanceof HTMLElement && element.nextSibling.firstChild instanceof HTMLImageElement) {
      await browser.runtime.sendMessage({ type: MESSAGE_ID, payload: element.nextSibling.firstChild.src });
    }
  }

  async function targetElementMessageListener(message: Record<string, unknown>): Promise<void> {
    if (message.type === 'ig-img-element' && typeof message.payload === 'number') {
      await findImageLink(browser.menus.getTargetElement(message.payload));
    }
  }

  browser.runtime.onMessage.addListener(targetElementMessageListener);
})();
