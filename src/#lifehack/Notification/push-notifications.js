const pushServerPublicKey = "BOkWACNDKja5Dgs_wv8UKbziwJq2AoUPioTIf6YxyhL6wOpplaUEgC9ed1nOq-KlGOUX67VLEqw3lxiR4Akb_Ko";

/**
 * checks if Push notification and service workers are supported by your browser
 */
function isPushNotificationSupported() {
  return "serviceWorker" in navigator && "PushManager" in window;
}

/**
 * asks user consent to receive push notifications and returns the response of the user, one of granted, default, denied
 */
async function askUserPermission() {
  return await Notification.requestPermission();
}
/**
 * shows a notification
 */
function sendNotification() {
  const img = "/images/jason-leung-HM6TMmevbZQ-unsplash.jpg";
  const text = "Take a look at this brand new t-shirt!";
  const title = "New Product Available";
  const options = {
    body: text,
    icon: "/images/jason-leung-HM6TMmevbZQ-unsplash.jpg",
    vibrate: [200, 100, 200],
    tag: "new-product",
    image: img,
    badge: "https://spyna.it/icons/android-icon-192x192.png",
    actions: [{ action: "Detail", title: "View", icon: "https://via.placeholder.com/128/ff0000" }]
  };
  navigator.serviceWorker.ready.then(function(serviceWorker) {
    serviceWorker.showNotification(title, options);
  });
}

/**
 *
 */
function registerServiceWorker() {
  return navigator.serviceWorker.register("/sw.js");
}

/**
 *
 * using the registered service worker creates a push notification subscription and returns it
 *
 */
async function createNotificationSubscription() {
  //wait for service worker installation to be ready
  const serviceWorker = await navigator.serviceWorker.ready;
  // subscribe and return the subscription
  return await serviceWorker.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: pushServerPublicKey
  });
}

/**
 * returns the subscription if present or nothing
 */
function getUserSubscription() {
  //wait for service worker installation to be ready, and then
  return navigator.serviceWorker.ready
    .then(function(serviceWorker) {
      return serviceWorker.pushManager.getSubscription();
    })
    .then(function(pushSubscription) {
      return pushSubscription;
    });
}
function loadVersionBrowser() {
  if ("userAgentData" in navigator) {
    const uaData = navigator.userAgentData;
    let browsername;
    let browserversion;
    let chromeVersion = null;
    for (var i = 0; i < uaData.brands.length; i++) {
      let brand = uaData.brands[i].brand;
      browserversion = uaData.brands[i].version;
      if (brand.match(/opera|chrome|edge|safari|firefox|msie|trident/i) !== null) {
        // If we have a chrome match, save the match, but try to find another match
        // E.g. Edge can also produce a false Chrome match.
        if (brand.match(/chrome/i) !== null) {
          chromeVersion = browserversion;
        }
        // If this is not a chrome match return immediately
        else {
          browsername = brand.substr(brand.indexOf(' ') + 1);
          return {
            name: browsername,
            version: browserversion
          }
        }
      }
    }
    // No non-Chrome match was found. If we have a chrome match, return it.
    if (chromeVersion !== null) {
      return {
        name: "chrome",
        version: chromeVersion
      }
    }
  }
  // If no userAgentData is not present, or if no match via userAgentData was found,
  // try to extract the browser name and version from userAgent
  const userAgent = navigator.userAgent;
  var ua = userAgent, tem, M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
  if (/trident/i.test(M[1])) {
    tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
    return { name: 'IE', version: (tem[1] || '') };
  }
  if (M[1] === 'Chrome') {
    tem = ua.match(/\bOPR\/(\d+)/);
    if (tem != null) {
      return { name: 'Opera', version: tem[1] };
    }
  }
  M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, '-?'];
  if ((tem = ua.match(/version\/(\d+)/i)) != null) {
    M.splice(1, 1, tem[1]);
  }
  return {
    name: M[0],
    version: M[1]
  };
};
export {
  isPushNotificationSupported,
  askUserPermission,
  registerServiceWorker,
  sendNotification,
  createNotificationSubscription,
  getUserSubscription,
  loadVersionBrowser,
};
