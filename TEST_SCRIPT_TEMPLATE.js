const constants = require('../global_constants');
const testData = require('../elements/testData');

describe('Tailor UI Refresh: Accessibility Tests', function () {
   this.tags = ['test'];

   // ------------------- Hooks -------------------
   before(function (browser) {
      // Setup code if needed
   });

   beforeEach(function (browser) {
      if (process.env.PLATFORM === "desktop") {
         browser.window.maximize();
      }
   });

   afterEach(function (browser) {
      browser.end();
   });

   after(function (browser) {
      // Cleanup if needed
   });


   // ------------------- Test -------------------
   describe('Launch and test on fake pharma site', function () {
      it('should search Nightwatch.js', function (browser) {
         const pageURL = "https://fake-pharma-site.netlify.app/?name=Automation%20Customer&env=dev&fuuid=663ccd1d-d432-4970-9714-f752c46bcc4e&flow=P51%20AQA%20EXAMPLE-TEST-FLOW-LCv4-Main&enableWebchat=true&test_only=true";
         browser.url(pageURL)
            .pause(4000);

         // Click webchat button
         shadowHelpers.clickShadow(browser, "#webchatv4", "#ostro-webchat-button");
         browser.pause(2000);

         // Accept Terms of Use if present
         shadowHelpers.clickShadow(browser, "#webchatv4", "a[href='https://www.ostrohealth.com/terms-of-use']");
         browser.pause(2000);

         // Back button from ToU page
         shadowHelpers.clickShadow(browser, "#webchatv4", "#ostro-webchat-back-button");
         browser.pause(2000);

         // Click Privacy Policy link
         shadowHelpers.clickShadow(browser, "#webchatv4", "a[href='https://www.ostrohealth.com/privacy-policy']");
         browser.pause(2000);

         // Back button from Privacy Policy page
         shadowHelpers.clickShadow(browser, "#webchatv4", "#ostro-webchat-back-button");

         // Click "I Agree" checkbox
         shadowHelpers.clickShadow(browser, "#webchatv4", "input[id='T&P-accept-T&P-accept']");
         browser.pause(2000);

         // Click Accept button
         shadowHelpers.clickShadow(browser, "#webchatv4", "#ostro-livechat-consent-form-submit");
         browser.pause(5000);

         // Type message into chat input
         shadowHelpers.typeShadow(browser, "#webchatv4", "#live-chat-prompt-textarea", "AQA Test: Hello!");
         browser.pause(5000);

         // Click Send button (SVG)
         shadowHelpers.clickShadow(browser, "#webchatv4", "rect[width='36']");
         browser.pause(4000);

         // Assert message is displayed in chat
         shadowHelpers.assertShadowText(browser, "#webchatv4", "#custom-scrollbar", "AQA Test: Hello!");
         browser.pause(2000);
      });
   });


   // ------------------- Helper Functions -------------------
   const shadowHelpers = {

      clickShadow: function (browser, shadowHostSelector, elementSelector) {
         browser.execute(function (hostSel, elemSel) {
            const host = document.querySelector(hostSel);
            if (!host || !host.shadowRoot) return false;

            const el = host.shadowRoot.querySelector(elemSel);
            if (!el) return false;

            // Click logic: normal HTML or SVG
            if (typeof el.click === 'function') {
               el.click();
            } else {
               const evt = new MouseEvent('click', { bubbles: true, cancelable: true });
               el.dispatchEvent(evt);
            }
            return true;
         }, [shadowHostSelector, elementSelector], function (result) {
            if (!result.value) {
               browser.assert.fail(`Shadow element not found or could not be clicked: ${elementSelector} inside ${shadowHostSelector}`);
            }
         });
      },

      typeShadow: function (browser, shadowHostSelector, elementSelector, text) {
         browser.execute(function (hostSel, elemSel) {
            const host = document.querySelector(hostSel);
            if (!host || !host.shadowRoot) return null;

            const el = host.shadowRoot.querySelector(elemSel);
            return el ? el : null;
         }, [shadowHostSelector, elementSelector], function (result) {
            if (result.value) {
               browser.click(result.value);
               browser.setValue(result.value, text);
            } else {
               browser.assert.fail(`Shadow element not found for typing: ${elementSelector} inside ${shadowHostSelector}`);
            }
         });
      },

      assertShadowText: function (browser, shadowHostSelector, elementSelector, expectedText) {
         browser.execute(function (hostSel, elemSel) {
            const host = document.querySelector(hostSel);
            if (!host || !host.shadowRoot) return null;

            const el = host.shadowRoot.querySelector(elemSel);
            return el ? el.textContent : null;
         }, [shadowHostSelector, elementSelector], function (result) {
            browser.assert.ok(result.value && result.value.includes(expectedText), `Text "${expectedText}" is present in ${elementSelector}`);
         });
      }
   };
});
