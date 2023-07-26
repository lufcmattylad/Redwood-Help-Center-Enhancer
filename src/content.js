const metaTag = document.querySelector('meta[property="og:site_name"]');
const isOracleHelpCenter = metaTag?.getAttribute('content') === 'Oracle Help Center';

let consecutiveEmptyRuns = 0;
let timeoutId;
const expandIcon = 'oj-ux-ico-expand-to-last-level';
const spinnerIcon = 'oj-ux-ico-animation';

function expandNavigationMenu() {
  const elements = document.querySelectorAll('.oj-collapsed ins.oj-default');

  if (elements.length === 0) {
    consecutiveEmptyRuns++;

    if (consecutiveEmptyRuns >= 5) {

      var buttonElement = document.getElementById('redwoodFullyExpand')
      buttonElement.classList.remove('oj-disabled');
      buttonElement.querySelectorAll('.redwood-icon-slot')[0].style.animation = '';

      const elementsToReplace = buttonElement.querySelectorAll('.redwood-icon-slot');
      elementsToReplace.forEach((element) => {
        element.classList.remove(spinnerIcon);
        element.classList.add(expandIcon);
      });

      clearTimeout(timeoutId);
      return;
    }
  } else {
    consecutiveEmptyRuns = 0;
  }

  elements.forEach((element) => {
    element.click();
  });

  timeoutId = setTimeout(expandNavigationMenu, 10);
}

function NavDrawerIsOpen() {
  return document.querySelectorAll("#navigationDrawer .oj-drawer-opened").length > 0;
}

function setupCustomButton(p_id, p_title, p_icon, onClickFunction) {
  var wad = `
    <div role="listitem"><roj-button id="{ID}"
    class="oj-lg-margin-3x-top oj-button-sm oj-button oj-button-half-chrome oj-button-icon-only oj-enabled oj-complete oj-default"
    aria-controls="navigationDrawer" aria-expanded="true" title="{TITLE}"><button class="oj-button-button"
        aria-label="{TITLE}">
        <div class="oj-button-label"><span class="oj-button-icon oj-start"><span slot="startIcon"
                    class="redwood-icon-slot {ICON}"></span></span><span></span></div>
    </button></roj-button></div>
    `;

  wad = wad.replace(/{ID}/g, p_id);
  wad = wad.replace(/{TITLE}/g, p_title);
  wad = wad.replace(/{ICON}/g, p_icon);

  // Create a temporary div element to hold the parsed HTML content
  var tempDiv = document.createElement('div');
  tempDiv.innerHTML = wad.trim();

  // directly append it
  var wadElement = tempDiv.firstChild;
  document.querySelector('#navigationContainer div[role="list"]').appendChild(wadElement);

  var wadButton = wadElement.getElementsByTagName('roj-button')[0];

  wadElement.addEventListener('click', onClickFunction);

  wadButton.addEventListener('mouseenter', () => {
    wadButton.classList.add('oj-hover');
    wadButton.classList.remove('oj-default');
  });

  wadButton.addEventListener('mouseleave', () => {
    wadButton.classList.remove('oj-hover');
    wadButton.classList.add('oj-default');
  });

}

function auxiliaryToolsDrawerOpen() {
  return document.querySelector('#auxiliaryToolsContainer .oj-drawer-opened .toggle-auxiliary-tools');
}

function addCustomButtons() {

  // -- Fully Expand
  setupCustomButton('redwoodFullyExpand', 'Expand to the Last Level [Added by Browser Extension]', expandIcon, function () {
    var buttonElement = document.getElementById('redwoodFullyExpand');
    const elementsToReplace = buttonElement.querySelectorAll('.redwood-icon-slot');
    elementsToReplace.forEach((element) => {
      element.classList.remove(expandIcon);
      element.classList.add(spinnerIcon);
    });
    buttonElement.classList.add('oj-disabled');
    buttonElement.querySelectorAll('.redwood-icon-slot')[0].style.animation = 'redwood-spin 1s linear infinite';
    setTimeout(expandNavigationMenu, 10);
  });


  // -- Expand/Collapse
  setupCustomButton('redwoodToggleExpand', 'Expand/Collapse [Added by Browser Extension]', 'oj-ux-ico-accordion', function () {
    document.getElementById('toggleTreeView').click();
  });

  // -- Title/Copyright
  setupCustomButton('redwoodGotoTitle', 'Title/Copyright [Added by Browser Extension]', 'oj-ux-ico-first-paragraph', function () {
    const navigationDrawer = document.getElementById("navigationDrawer");
    const firstInsElement = navigationDrawer.querySelector("ins");
    if (firstInsElement) {
      firstInsElement.click();
    }
  });

  // -- Scroll to the Top
  setupCustomButton('redwoodToTheTop', 'Scroll to the Top [Added by Browser Extension]', 'oj-ux-ico-arrow-circle-up', function () {
    window.scrollTo({
      top: 0,
      behavior: 'auto'
    });
  });
}

function shutAuxiliaryToolsDrawer() {
  // Close Auxiliary Tools Drawer
  var auxiliaryToolsDrawer = auxiliaryToolsDrawerOpen();
  if (auxiliaryToolsDrawer) {
    auxiliaryToolsDrawer.click();
  }
}

function init() {

  if (isOracleHelpCenter) {
    const observer = new MutationObserver((mutationsList) => {
      for (const mutation of mutationsList) {
        if (
          mutation.type === 'childList' &&
          document.querySelector("#navigationDrawer")
        ) {

          // Wait until OJ renders the Navigation Drawer
          if (NavDrawerIsOpen()
          ) {
            // Disconnect Observer
            observer.disconnect();
            addCustomButtons();
            shutAuxiliaryToolsDrawer();
            break;
          }
        }
      }
    });

    observer.observe(document.documentElement, { childList: true, subtree: true });
  }

}

init();