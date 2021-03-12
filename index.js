// xử lí tổng
function Validator(options) {
  // lưu trữ dữ liệu lỗi
  var selectorList = {};

  // Hàm xử lí dữ liệu lỗi
  function validate(inputElement, rule, span, formChild) {
    var ruleExtend = selectorList[rule.selector];
    var errorMessage;
    // Tìm errorMessage
    for (var i = 0; i < ruleExtend.length; i++) {
      //    console.log(ruleExtend[i]);
      errorMessage = ruleExtend[i](inputElement.value);
      if (errorMessage) {
        break;
      }
    }
    if (errorMessage) {
      span.innerHTML = errorMessage;
      formChild.classList.add("isValid");
    } else {
      span.innerHTML = ``;
      formChild.classList.remove("isValid");
    }
    return !errorMessage;
  } //end
  // xử lí kiểm tra form
  const formElement = document.querySelector(options.form);
  if (formElement) {
    //chăn load trang
    formElement.onsubmit = (e) => {
      e.preventDefault();
      var isFormValid = true;
      options.rules.forEach((rule) => {
        const inputElement = formElement.querySelector(rule.selector);
        const span = inputElement.nextElementSibling;
        const formChild = inputElement.parentElement;
        var isValid = validate(inputElement, rule, span, formChild);
        if (!isValid) {
          isFormValid = false;
        }
      });
      if (isFormValid) {
        if (typeof options.onSubmit === "function") {
          const valueOptions = formElement.querySelectorAll(
            'input:not([type="submit"])'
          );
          const listValueForm = {};
          Array.from(valueOptions).forEach((value) => {
            listValueForm[value.id] = value.value;
          });
          options.onSubmit(listValueForm);
        }
      }
    };
    options.rules.forEach((rule) => {
      const inputElement = formElement.querySelector(rule.selector);
      const span = inputElement.nextElementSibling;
      const formChild = inputElement.closest('.formChild');

      // thêm các rule test vào list selector
      if (Array.isArray(selectorList[rule.selector])) {
        selectorList[rule.selector].push(rule.test);
      } else {
        selectorList[rule.selector] = [rule.test];
      }
      //   console.log(selectorList);
      //sự kiện blur hoặc input
      if (inputElement) {
        // khi người dùng blur
        inputElement.onblur = () => {
          validate(inputElement, rule, span, formChild);
        };
        //khi người dùng nhập inout cũng xoá dòng cảnh báo
        inputElement.oninput = () => {
          span.innerHTML = ``;
          formChild.classList.remove("isValid");
        };
      }
    });
  } //end
}
Validator.isRequired = function (selector) {
  return {
    selector,
    test: (value) => {
      return value.trim()
        ? undefined
        : `<i class="fa fa-exclamation-triangle" aria-hidden="true"> Vui lòng nhập  ${
            document.querySelector(selector).title
          }`;
    },
  };
};
Validator.isEmail = function (selector) {
  return {
    selector,
    test: (value) => {
      const regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return regex.test(value)
        ? undefined
        : `<i class="fas fa-exclamation"></i> Vui lòng nhập đúng ${
            document.querySelector(".formControl .formChild #email").title
          }`;
    },
  };
};
Validator.isPassword = function (selector, minLengthPassword) {
  return {
    selector,
    test: (value) => {
      const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
      return regex.test(value)
        ? undefined
        : `<i class="fas fa-lock"></i> Mật khẩu ít nhất ${minLengthPassword} kí tự (VD: Ab$1...)`;
    },
  };
};
Validator.isRePassword = function (selector, isConfirmPassword) {
  return {
    selector,
    test: (value) => {
      return value.trim() && value.trim() == isConfirmPassword()
        ? undefined
        : `<i class="fas fa-lock"></i> ${
            document.querySelector(selector).title
          } không khớp`;
    },
  };
};
//xử lí showPassword
const showPassword = document.querySelector(".showPassword");

showPassword.addEventListener("click", () => {
  if (!showPassword.classList.contains("active")) {
    showPassword.classList.add("active");
    showPassword.innerHTML = `<i class="fas fa-eye-slash"></i>`;
    showPassword.previousElementSibling.previousElementSibling.type =
      "password";
  } else {
    showPassword.classList.remove("active");
    showPassword.innerHTML = `<i class="fas fa-eye"></i>`;
    showPassword.previousElementSibling.previousElementSibling.type = "text";
  }
});
