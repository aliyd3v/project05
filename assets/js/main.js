(function () {
  "use strict";

  const url = 'http://localhost:3030/api'

  etap1()
  etap2()
  etap3()

  function etap1() {
    fetch(`${url}/categories`)
      .then(res => res.json())
      .then(res => {
        if (res.success) {
          renderCategories(res.data.categories)
        }
      })
      .catch(error => console.log(error))

    function renderCategories(categories) {
      let categoriesUl = document.getElementById('categories-ul')
      for (let i = 0; i < categories.length; i++) {
        let li = document.createElement('li')
        li.setAttribute('data-filter', `.filter-${categories[i].en_name}`)
        li.textContent = `${categories[i].en_name}`
        categoriesUl.appendChild(li)
      }
    }
  }

  function etap2() {
    /**
   * Init isotope layout and filters
  */
    document.querySelectorAll('.isotope-layout').forEach(function (isotopeItem) {
      let layout = isotopeItem.getAttribute('data-layout') ?? 'masonry';
      let filter = isotopeItem.getAttribute('data-default-filter') ?? '*';
      let sort = isotopeItem.getAttribute('data-sort') ?? 'original-order';

      let initIsotope;
      imagesLoaded(isotopeItem.querySelector('.isotope-container'), function () {
        initIsotope = new Isotope(isotopeItem.querySelector('.isotope-container'), {
          itemSelector: '.isotope-item',
          layoutMode: layout,
          filter: filter,
          sortBy: sort
        });
      });

      isotopeItem.querySelectorAll('.isotope-filters li').forEach(function (filters) {
        filters.addEventListener('click', function () {
          isotopeItem.querySelector('.isotope-filters .filter-active').classList.remove('filter-active');
          this.classList.add('filter-active');
          initIsotope.arrange({
            filter: this.getAttribute('data-filter')
          });
          if (typeof aosInit === 'function') {
            aosInit();
          }
        }, false);
      });

    });
  }

  function etap3() {
    fetch(`${url}/meals`)
      .then(res => res.json())
      .then(res => {
        if (res.success) {
          renderMeals(res.data.meals);
        }
      })
      .catch(error => console.log(error));

    function renderMeals(meals) {
      let mainContainer = document.getElementById('meals-container');
      let mealsContainer = document.createElement('div');
      let mainCartContainer = document.getElementById('cart-container');
      let cartContainer = document.createElement('div');

      (function eachMeals(meals) {
        mealsContainer.classList.add("row", "isotope-container");
        mealsContainer.setAttribute('data-aos', 'fade-up');
        mealsContainer.setAttribute('data-aos-delay', '200');

        cartContainer.classList.add("row", "isotope-container");
        cartContainer.setAttribute('data-aos', 'fade-up');
        cartContainer.setAttribute('data-aos-delay', '200');

        for (let i = 0; i < meals.length; i++) {
          renderingMeal(meals[i]);
        };
        mainContainer.appendChild(mealsContainer);
        mainCartContainer.appendChild(cartContainer);
      })(meals);

      function renderingMeal(meal) {
        // Cart item
        let isExist = false
        for (let i = 0; i < localStorage.length; i++) {
          localStorage.key(i).includes(`cart-item-${meal._id}`) ? isExist = true : false
        }
        if (isExist) {
          let cartItemDiv = document.createElement("div");
          cartItemDiv.classList.add("col-lg-6", "menu-item", "isotope-item");
          let cartItemImg = document.createElement('img');
          cartItemImg.src = `${meal.image_url}`;
          cartItemImg.classList.add('menu-img');
          let divInCartItem = document.createElement('div');
          divInCartItem.classList.add('menu-content');
          let aCartItem = document.createElement('a');
          aCartItem.textContent = `${meal.en_name}`;
          let spanCartItem = document.createElement('span');
          spanCartItem.textContent = `$${meal.price}`;
          let divIn2CartItem = document.createElement('div');
          divIn2CartItem.classList.add('menu-ingredients', 'd-flex');
          divIn2CartItem.textContent = `${meal.en_description}`;


          // new thing for cart item managing.
          let itemMinus = document.createElement('button');
          itemMinus.classList.add('btn-sm', 'ms-end', 'cart-item-minus-btn');
          let itemMinusText = document.createElement('p');
          itemMinusText.textContent = '-';
          itemMinus.appendChild(itemMinusText)

          let itemCount = document.createElement('p');
          itemCount.classList.add('cart-item-count-text');
          itemCount.textContent = `${localStorage.getItem(`cart-item-${meal._id}`)}`;

          let itemPlus = document.createElement('button');
          itemPlus.classList.add('btn-sm', 'cart-item-plus-btn');
          let itemPlusText = document.createElement('p');
          itemPlusText.textContent = '+';
          itemPlus.appendChild(itemPlusText)




          let btnCartItem = document.createElement('button');
          btnCartItem.classList.add('btn-sm', 'ms-auto');
          let iconCartRemove = document.createElement('i');
          iconCartRemove.classList.add('bi', 'bi-cart-x-fill', 'cart-remove');
          btnCartItem.appendChild(iconCartRemove);
          btnCartItem.dataset.id = meal._id;
          btnCartItem.addEventListener('click', () => {
            console.log(localStorage.getItem(`cart-item-${meal._id}`));
          });
          divInCartItem.appendChild(aCartItem);
          divInCartItem.appendChild(spanCartItem);
          divIn2CartItem.appendChild(itemMinus);
          divIn2CartItem.appendChild(itemCount);
          divIn2CartItem.appendChild(itemPlus);
          divIn2CartItem.appendChild(btnCartItem);
          cartItemDiv.appendChild(cartItemImg);
          cartItemDiv.appendChild(divInCartItem);
          cartItemDiv.appendChild(divIn2CartItem);
          cartContainer.appendChild(cartItemDiv);
        }

        // Menu item
        let div = document.createElement("div");
        let filter = `filter-${meal.category.en_name}`;
        div.classList.add("col-lg-6", "menu-item", "isotope-item", filter);
        let img = document.createElement('img');
        img.src = `${meal.image_url}`;
        img.classList.add('menu-img');
        let divIn = document.createElement('div');
        divIn.classList.add('menu-content');
        let a = document.createElement('a');
        a.textContent = `${meal.en_name}`;
        let span = document.createElement('span');
        span.textContent = `$${meal.price}`;
        let divIn2 = document.createElement('div');
        divIn2.classList.add('menu-ingredients', 'd-flex');
        divIn2.textContent = `${meal.en_description}`;
        let btn = document.createElement('button');
        btn.classList.add('btn-sm', 'ms-auto');
        let iconCartPlus = document.createElement('i');
        iconCartPlus.classList.add('bi', 'bi-cart-plus-fill', 'cart-plus');
        btn.appendChild(iconCartPlus);
        btn.dataset.id = meal._id;
        let cartAdded = document.createElement('i');
        cartAdded.classList.add('bi', 'bi-cart-check-fill', 'ms-auto', 'checked-cart');
        btn.addEventListener('click', () => {
          let arr = [];
          for (let i = 0; i < localStorage.length; i++) {
            localStorage.key(i).includes('cart-item') ? arr.push(localStorage.key(i)) : false
          }
          if (arr.includes(`cart-item-${meal._id}`)) {
            false
          } else {
            localStorage.setItem(`cart-item-${meal._id}`, 1);
            btn.style.display = 'none';
            divIn2.appendChild(cartAdded);
          }
        });
        divIn.appendChild(a);
        divIn.appendChild(span);
        (function () {
          if (localStorage.getItem(`cart-item-${meal._id}`)) {
            divIn2.appendChild(cartAdded)
          } else {
            divIn2.appendChild(btn)
          }
        })();
        div.appendChild(img);
        div.appendChild(divIn);
        div.appendChild(divIn2);
        mealsContainer.appendChild(div);
      };
    }
  }

  /**
   * Apply .scrolled class to the body as the page is scrolled down
   */
  function toggleScrolled() {
    const selectBody = document.querySelector('body');
    const selectHeader = document.querySelector('#header');
    if (!selectHeader.classList.contains('scroll-up-sticky') && !selectHeader.classList.contains('sticky-top') && !selectHeader.classList.contains('fixed-top')) return;
    window.scrollY > 100 ? selectBody.classList.add('scrolled') : selectBody.classList.remove('scrolled');
  }

  document.addEventListener('scroll', toggleScrolled);
  window.addEventListener('load', toggleScrolled);

  /**
   * Mobile nav toggle
   */
  const mobileNavToggleBtn = document.querySelector('.mobile-nav-toggle');

  function mobileNavToogle() {
    document.querySelector('body').classList.toggle('mobile-nav-active');
    mobileNavToggleBtn.classList.toggle('bi-list');
    mobileNavToggleBtn.classList.toggle('bi-x');
  }
  mobileNavToggleBtn.addEventListener('click', mobileNavToogle);

  /**
   * Hide mobile nav on same-page/hash links
   */
  document.querySelectorAll('#navmenu a').forEach(navmenu => {
    navmenu.addEventListener('click', () => {
      if (document.querySelector('.mobile-nav-active')) {
        mobileNavToogle();
      }
    });

  });

  /**
   * Toggle mobile nav dropdowns
   */
  document.querySelectorAll('.navmenu .toggle-dropdown').forEach(navmenu => {
    navmenu.addEventListener('click', function (e) {
      e.preventDefault();
      this.parentNode.classList.toggle('active');
      this.parentNode.nextElementSibling.classList.toggle('dropdown-active');
      e.stopImmediatePropagation();
    });
  });

  /**
   * Preloader
   */
  const preloader = document.querySelector('#preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      preloader.remove();
    });
  }

  /**
   * Scroll top button
   */
  let scrollTop = document.querySelector('.scroll-top');

  function toggleScrollTop() {
    if (scrollTop) {
      window.scrollY > 100 ? scrollTop.classList.add('active') : scrollTop.classList.remove('active');
    }
  }
  scrollTop.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  window.addEventListener('load', toggleScrollTop);
  document.addEventListener('scroll', toggleScrollTop);

  /**
   * Animation on scroll function and init
   */
  function aosInit() {
    AOS.init({
      duration: 600,
      easing: 'ease-in-out',
      once: true,
      mirror: false
    });
  }
  window.addEventListener('load', aosInit);

  /**
   * Initiate glightbox
   */
  const glightbox = GLightbox({
    selector: '.glightbox'
  });

  /**
   * Init swiper sliders
   */
  function initSwiper() {
    document.querySelectorAll(".init-swiper").forEach(function (swiperElement) {
      let config = JSON.parse(
        swiperElement.querySelector(".swiper-config").innerHTML.trim()
      );

      if (swiperElement.classList.contains("swiper-tab")) {
        initSwiperWithCustomPagination(swiperElement, config);
      } else {
        new Swiper(swiperElement, config);
      }
    });
  }

  window.addEventListener("load", initSwiper);

  /**
   * Correct scrolling position upon page load for URLs containing hash links.
   */
  window.addEventListener('load', function (e) {
    if (window.location.hash) {
      if (document.querySelector(window.location.hash)) {
        setTimeout(() => {
          let section = document.querySelector(window.location.hash);
          let scrollMarginTop = getComputedStyle(section).scrollMarginTop;
          window.scrollTo({
            top: section.offsetTop - parseInt(scrollMarginTop),
            behavior: 'smooth'
          });
        }, 100);
      }
    }
  });

  /**
   * Navmenu Scrollspy
   */
  let navmenulinks = document.querySelectorAll('.navmenu a');

  function navmenuScrollspy() {
    navmenulinks.forEach(navmenulink => {
      if (!navmenulink.hash) return;
      let section = document.querySelector(navmenulink.hash);
      if (!section) return;
      let position = window.scrollY + 200;
      if (position >= section.offsetTop && position <= (section.offsetTop + section.offsetHeight)) {
        document.querySelectorAll('.navmenu a.active').forEach(link => link.classList.remove('active'));
        navmenulink.classList.add('active');
      } else {
        navmenulink.classList.remove('active');
      }
    })
  }
  window.addEventListener('load', navmenuScrollspy);
  document.addEventListener('scroll', navmenuScrollspy);

})();