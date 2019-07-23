'use strict';

document.addEventListener('DOMContentLoaded', function () {

  // Cookies

  var cookieBookModalName = 'bulma_closed_book_modal';
  var cookieBookModal = Cookies.getJSON(cookieBookModalName) || false;

  // Sidebar links

  var $categories = getAll('#categories .bd-category');

  if ($categories.length > 0) {
    $categories.forEach(function (el) {
      var toggle_el = el.querySelector('.bd-category-toggle');

      toggle_el.addEventListener('click', function (event) {
        // closeCategories(el);
        el.classList.toggle('is-active');
      });
    });
  }

  function closeCategories(current_el) {
    $categories.forEach(function (el) {
      if (current_el == el) {
        return;
      }
      el.classList.remove('is-active');
    });
  }

  var anchors_ref_el = document.getElementById('anchorsReference');
  var anchors_el = document.getElementById('anchors');
  var anchor_links_el = getAll('.bd-anchor-link');

  var anchors_by_id = {};
  var anchors_order = [];
  var anchor_nav_els = [];

  if (anchors_el && anchor_links_el.length > 0) {
    anchors_el.classList.add('is-active');
    var anchors_el_list = anchors_el.querySelector('.bd-anchors-list');

    anchor_links_el.forEach(function (el, index) {
      var link_target = el.getAttribute('href');
      var link_text = el.previousElementSibling.innerText;

      if (link_text != '') {
        var item_el = createAnchorLink(link_text, link_target);
        anchors_el_list.appendChild(item_el);

        var anchor_key = link_target.substring(1); // #target -> target
        anchors_by_id[anchor_key] = {
          id: anchor_key,
          index: index,
          target: link_target,
          text: link_text,
          nav_el: item_el
        };
        anchors_order.push(anchor_key);
        anchor_nav_els.push(item_el);
      }
    });

    var back_to_top_el = createAnchorLink('Back to top', '');
    back_to_top_el.onclick = scrollToTop;
    anchors_el_list.appendChild(back_to_top_el);
  }

  function scrollToTop() {
    window.scrollTo(0, 0);
  }

  function createAnchorLink(text, target) {
    var item_el = document.createElement('li');
    var link_el = document.createElement('a');
    var text_node = document.createTextNode(text);

    if (target) {
      link_el.setAttribute('href', target);
    }

    link_el.appendChild(text_node);
    item_el.appendChild(link_el);

    return item_el;
  }

  function closeCategories(current_el) {
    $categories.forEach(function (el) {
      if (current_el == el) {
        return;
      }
      el.classList.remove('is-active');
    });
  }

  // Meta links

  var $metalinks = getAll('#meta a');

  if ($metalinks.length > 0) {
    $metalinks.forEach(function ($el) {
      $el.addEventListener('click', function (event) {
        event.preventDefault();
        var target = $el.getAttribute('href');
        var $target = document.getElementById(target.substring(1));
        $target.scrollIntoView(true);
        return false;
      });
    });
  }

  // Dropdowns

  var $dropdowns = getAll('.dropdown:not(.is-hoverable)');

  if ($dropdowns.length > 0) {
    $dropdowns.forEach(function ($el) {
      $el.addEventListener('click', function (event) {
        event.stopPropagation();
        $el.classList.toggle('is-active');
      });
    });

    document.addEventListener('click', function (event) {
      closeDropdowns();
    });
  }

  function closeDropdowns() {
    $dropdowns.forEach(function ($el) {
      $el.classList.remove('is-active');
    });
  }

  // Toggles

  var $burgers = getAll('.burger');

  if ($burgers.length > 0) {
    $burgers.forEach(function ($el) {
      $el.addEventListener('click', function () {
        var target = $el.dataset.target;
        var $target = document.getElementById(target);
        $el.classList.toggle('is-active');
        $target.classList.toggle('is-active');
      });
    });
  }

  var $genericToggles = getAll('.bd-toggle');
  $genericToggles.forEach(function ($el) {
    var $targets = getAll($el.dataset.target);
    var targetClasses = splitNoEmpy($el.dataset.targetClass || '', ' ');
    var ownClasses = splitNoEmpy($el.dataset.ownClass || '', ' ');
    $el.addEventListener('click', function () {
      targetClasses.forEach(function (targetClass) {
        return $targets.forEach(function ($target) {
          return $target.classList.toggle(targetClass);
        });
      });
      ownClasses.forEach(function (ownClass) {
        return $el.classList.toggle(ownClass);
      });
    });
  });

  var $genericRadioToggles = getAll('.bd-toggle-radio-group');
  $genericRadioToggles.forEach(function ($group) {
    var childSelector = $group.dataset.childSelector || '';
    var $childNodes = childSelector.length > 0 ? getAll(childSelector, $group) : Array.prototype.slice.call($group.children, 0);
    var $radios = $childNodes.filter(function ($child) {
      return $child.classList.contains('bd-toggle-radio');
    });
    var $targets = getAll($group.dataset.target);
    var radioData = $radios.map(function ($radio) {
      var self = {};
      self.$element = $radio;
      self.targetClasses = splitNoEmpy($radio.dataset.targetClass || '', ' ');
      self.ownClasses = splitNoEmpy($radio.dataset.ownClass || '', ' ');
      self.isActive = ($radio.dataset.active || '').toLowerCase() == "true";
      self.toggle = function () {
        // toggle targets
        self.targetClasses.forEach(function (targetClass) {
          return $targets.forEach(function ($target) {
            return $target.classList.toggle(targetClass);
          });
        });
        // toggle self
        self.ownClasses.forEach(function (ownClass) {
          return self.$element.classList.toggle(ownClass);
        });
        self.isActive = !self.isActive;
      };
      self.onClick = function () {
        radioData.filter(function (other) {
          return other.isActive;
        }).forEach(function (other) {
          return other.toggle();
        });
        self.toggle();
      };
      return self;
    });
    // handle click and inital isActive
    radioData.forEach(function (data) {
      data.$element.addEventListener('click', data.onClick);
    });
  });

  // Modals

  var rootEl = document.documentElement;
  var $modals = getAll('.modal');
  var $modalButtons = getAll('.modal-button');
  var $modalCloses = getAll('.modal-background, .modal-close, .modal-card-head .delete, .modal-card-foot .button');

  if ($modalButtons.length > 0) {
    $modalButtons.forEach(function ($el) {
      $el.addEventListener('click', function () {
        var target = $el.dataset.target;
        openModal(target);
      });
    });
  }

  if ($modalCloses.length > 0) {
    $modalCloses.forEach(function ($el) {
      $el.addEventListener('click', function () {
        closeModals();
      });
    });
  }

  function openModal(target) {
    var $target = document.getElementById(target);
    rootEl.classList.add('is-clipped');
    $target.classList.add('is-active');
  }

  function closeModals() {
    rootEl.classList.remove('is-clipped');
    $modals.forEach(function ($el) {
      $el.classList.remove('is-active');
    });
  }

  document.addEventListener('keydown', function (event) {
    var e = event || window.event;
    if (e.keyCode === 27) {
      closeModals();
      closeDropdowns();
    }
  });

  // Clipboard

  var $highlights = getAll('.highlight');
  var itemsProcessed = 0;

  if ($highlights.length > 0) {
    $highlights.forEach(function ($el) {
      var copyEl = '<button class="button is-small bd-copy">Copy</button>';
      var expandEl = '<button class="button is-small bd-expand">Expand</button>';
      $el.insertAdjacentHTML('beforeend', copyEl);

      var $parent = $el.parentNode;
      if ($parent && $parent.classList.contains('bd-is-more')) {
        var showEl = '<button class="bd-show"><div><span class="icon"><i class="fas fa-code"></i></span> <strong>Show code</strong></div></button>';
        $el.insertAdjacentHTML('beforeend', showEl);
      } else if ($el.firstElementChild.scrollHeight > 480 && $el.firstElementChild.clientHeight <= 480) {
        $el.insertAdjacentHTML('beforeend', expandEl);
      }

      itemsProcessed++;
      if (itemsProcessed === $highlights.length) {
        addHighlightControls();
      }
    });
  }

  function addHighlightControls() {
    var $highlightButtons = getAll('.highlight .bd-copy, .highlight .bd-expand');

    $highlightButtons.forEach(function ($el) {
      $el.addEventListener('mouseenter', function () {
        $el.parentNode.classList.add('bd-is-hovering');
      });

      $el.addEventListener('mouseleave', function () {
        $el.parentNode.classList.remove('bd-is-hovering');
      });
    });

    var $highlightExpands = getAll('.highlight .bd-expand');

    $highlightExpands.forEach(function ($el) {
      $el.addEventListener('click', function () {
        $el.parentNode.firstElementChild.style.maxHeight = 'none';
      });
    });

    var $highlightShows = getAll('.highlight .bd-show');

    $highlightShows.forEach(function ($el) {
      $el.addEventListener('click', function () {
        $el.parentNode.parentNode.classList.remove('bd-is-more-clipped');
      });
    });
  }

  setTimeout(function () {
    new Clipboard('.bd-copy', {
      target: function target(trigger) {
        return trigger.previousElementSibling.firstElementChild;
      }
    });
  }, 100);

  // Functions

  function getAll(selector, $context) {
    $context = $context || document;
    if (selector.length <= 0) return [];
    return Array.prototype.slice.call($context.querySelectorAll(selector), 0);
  }

  function splitNoEmpy(str, splitby) {
    return str.split(splitby).filter(function (p) {
      return p.length > 0;
    });
  }

  // Scrolling

  var html_el = document.documentElement;
  var navbarEl = document.getElementById('navbar');
  var navbarBurger = document.getElementById('navbarBurger');
  var specialShadow = document.getElementById('specialShadow');
  var NAVBAR_HEIGHT = 52;
  var THRESHOLD = 160;
  var horizon = NAVBAR_HEIGHT;
  var whereYouStoppedScrolling = 0;
  var scrollFactor = 0;
  var currentTranslate = 0;

  // Anchors highlight

  var past_anchors = [];
  anchor_links_el.reverse();
  var trigger_offset = 24; // In pixels
  var typo_el = document.getElementById('typo');

  function whenScrolling() {
    if (anchors_ref_el) {
      var bounds = anchors_ref_el.getBoundingClientRect();
      var anchors_height = anchors_el.clientHeight;
      var typo_bounds = typo_el.getBoundingClientRect();
      var typo_height = typo_el.clientHeight;

      if (bounds.top < 1 && typo_bounds.top - anchors_height + typo_height > 0) {
        anchors_el.classList.add('is-pinned');
      } else {
        anchors_el.classList.remove('is-pinned');
      }

      anchor_links_el.some(function (el) {
        var bounds = el.getBoundingClientRect();
        var href = el.getAttribute('href');
        var key = href.substring(1); // #target -> target

        if (bounds.top < 1 + trigger_offset && past_anchors.indexOf(key) == -1) {
          past_anchors.push(key);
          highlightAnchor();
          return;
        } else if (bounds.top > 0 + trigger_offset && past_anchors.indexOf(key) != -1) {
          removeFromArray(past_anchors, key);
          highlightAnchor();
          return;
        }
      });
    }
  }

  function highlightAnchor() {
    var future_anchors = anchors_order.diff(past_anchors);
    var highest_index = -1;
    var highest_anchor_key = '';

    if (past_anchors.length > 0) {
      past_anchors.forEach(function (key, index) {
        var anchor = anchors_by_id[key];
        anchor.nav_el.className = 'is-past';

        // Keep track of the bottom most item
        if (anchor.index > highest_index) {
          highest_index = anchor.index;
          highest_anchor_key = key;
        }
      });

      if (highest_anchor_key in anchors_by_id) {
        anchors_by_id[highest_anchor_key].nav_el.className = 'is-current';
      }
    }

    if (future_anchors.length > 0) {
      future_anchors.forEach(function (key, index) {
        var anchor = anchors_by_id[key];
        anchor.nav_el.className = '';
      });
    }
  }

  // Scroll

  function upOrDown(lastY, currentY) {
    if (currentY >= lastY) {
      return goingDown(currentY);
    }
    return goingUp(currentY);
  }

  function goingDown(currentY) {
    var trigger = NAVBAR_HEIGHT;
    whereYouStoppedScrolling = currentY;

    if (currentY > horizon) {
      horizon = currentY;
    }

    translateHeader(currentY, false);
  }

  function goingUp(currentY) {
    var trigger = 0;

    if (currentY < whereYouStoppedScrolling - NAVBAR_HEIGHT) {
      horizon = currentY + NAVBAR_HEIGHT;
    }

    translateHeader(currentY, true);
  }

  function constrainDelta(delta) {
    return Math.max(0, Math.min(delta, NAVBAR_HEIGHT));
  }

  function translateHeader(currentY, upwards) {
    // let topTranslateValue;
    var translateValue = void 0;

    if (upwards && currentTranslate == 0) {
      translateValue = 0;
    } else if (currentY <= NAVBAR_HEIGHT) {
      translateValue = currentY * -1;
    } else {
      var delta = constrainDelta(Math.abs(currentY - horizon));
      translateValue = delta - NAVBAR_HEIGHT;
    }

    if (translateValue != currentTranslate) {
      var navbarStyle = '\n        transform: translateY(' + translateValue + 'px);\n      ';
      currentTranslate = translateValue;
      navbarEl.setAttribute('style', navbarStyle);
    }

    if (currentY > THRESHOLD * 2) {
      scrollFactor = 1;
    } else if (currentY > THRESHOLD) {
      scrollFactor = (currentY - THRESHOLD) / THRESHOLD;
    } else {
      scrollFactor = 0;
    }

    var translateFactor = 1 + translateValue / NAVBAR_HEIGHT;

    if (specialShadow) {
      specialShadow.style.opacity = scrollFactor;
      specialShadow.style.transform = 'scaleY(' + translateFactor + ')';
    }
  }

  var ticking = false;
  var lastY = 0;

  window.addEventListener('scroll', function () {
    var currentY = window.scrollY;

    if (!ticking) {
      window.requestAnimationFrame(function () {
        // upOrDown(lastY, currentY);
        whenScrolling();
        ticking = false;
        lastY = currentY;
      });
    }

    ticking = true;
  });

  // Utils

  function removeFromArray(array, value) {
    if (array.includes(value)) {
      var value_index = array.indexOf(value);
      array.splice(value_index, 1);
    }

    return array;
  }

  Array.prototype.diff = function (a) {
    return this.filter(function (i) {
      return a.indexOf(i) < 0;
    });
  };
});