function scrollFunction() {
  var navbar = document.getElementById("nav");
  if (!navbar) {
    return;
  }

  if (document.body.scrollTop > 280 || document.documentElement.scrollTop > 280) {
    navbar.style.opacity = "1";
  } else {
    navbar.style.opacity = "0";
  }
}

function includeHTML() {
  var includeElements = Array.prototype.slice.call(document.querySelectorAll('[data-include]'));
  var includePromises = includeElements.map(function(element) {
    var file = element.getAttribute('data-include');
    if (!file) {
      return Promise.resolve();
    }

    return fetch(file)
      .then(function(response) {
        if (!response.ok) {
          throw new Error('Unable to load ' + file + ': ' + response.status + ' ' + response.statusText);
        }
        return response.text();
      })
      .then(function(data) {
        element.innerHTML = data;
      })
      .catch(function(error) {
        console.error(error);
        element.innerHTML = '<p class="text-danger">Unable to load ' + file + '.</p>';
      });
  });

  return Promise.all(includePromises);
}

document.addEventListener('DOMContentLoaded', function() {
  includeHTML().then(function() {
    scrollFunction();
  });
});

window.addEventListener('scroll', scrollFunction);
