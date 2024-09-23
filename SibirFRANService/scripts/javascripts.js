// Установка cookie
function setCookie(name, value, days) {
    let expires = "";
    if (days) {
        const date = new Date();
        date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

// Получение cookie
function getCookie(name) {
    const nameEQ = name + "=";
    const cookieArray = document.cookie.split(";");
    for (let i = 0; i < cookieArray.length; i++) {
        let aCookie = cookieArray[i];
        while (aCookie.charAt(0) === " ") aCookie = aCookie.substring(1, aCookie.length);
        if (aCookie.indexOf(nameEQ) === 0)
            return aCookie.substring(nameEQ.length, aCookie.length);
    }
    return null;
}

// Проверка наличия согласия на использование cookie и отображение баннера
window.onload = function () {
    if (!getCookie("cookie_consent")) {
        document.getElementById("cookie-banner").style.display = "flex";
    }

    // Скрытие баннера согласия с cookie при нажатии кнопки "ОК"
    document.getElementById("accept-cookies").onclick = function () {
        setCookie("cookie_consent", "accepted", 30); // Хранить 30 дней
        document.getElementById("cookie-banner").style.display = "none";
    };
};

// Анимации баннеров Услуги
function animaionItem(i) {
    let itemsArray = document.getElementsByClassName("service-item-name");
    let item = itemsArray[i - 1];
    let itemWrapArr = document.getElementsByClassName("service-item");
    let itemWrap = itemWrapArr[i - 1];

    if (item.classList.contains("showNote")) {
        function removeText() {
            (function () {
                document.getElementById("service-note" + i).style.visibility = "hidden";
                document.getElementById("service-note" + i).style.left = "300px";
                document.getElementById("service-note" + i).style.transition = "1s";
            })();
            item.classList.remove("showNote");
            itemWrap.style.padding = "80px 0 0 0";
            itemWrap.style.transition = "1s";
        }
        setTimeout(removeText, 200);
    } else {
        item.classList.add("showNote");
        itemWrap.style.padding = "0px";
        itemWrap.style.transition = "1s";
        function text() {
            document.getElementById("service-note" + i).style.visibility = "visible";
            document.getElementById("service-note" + i).style.left = "0px";
            document.getElementById("service-note" + i).style.transition = "1s";
        }
        setTimeout(text, 200);
    }
}

// Очищаем текущее поле инпута при нажатии Escape
function сlearInputByEsc() {
    const inputs = document.querySelectorAll(".form__input");

    inputs.forEach((input) => {
        input.addEventListener("keydown", function (event) {
            if (event.key === "Escape") {
                this.value = "";
            }
        });
    });
}
сlearInputByEsc();

// Маска ввода номера телефона в форму
document.addEventListener("DOMContentLoaded", function () {
    function initializePhoneMask() {
        let input = document.getElementById("phone");

        input.addEventListener("input", phoneMask);
        input.addEventListener("focus", phoneMask);
        input.addEventListener("blur", phoneMask);

        function phoneMask(event) {
            let blank = "+_ (___) ___-__-__";
            let i = 0;
            let val = this.value.replace(/\D/g, "").replace(/^8/, "7");

            this.value = blank.replace(/./g, function (char) {
                if (/[_\d]/.test(char) && i < val.length) return val.charAt(i++);
                return i >= val.length ? "" : char;
            });

            if (event.type == "blur") {
                if (this.value.length == 2) this.value = "";
            } else {
                setCursorPosition(this, this.value.length);
            }
        }

        function setCursorPosition(elem, pos) {
            elem.focus();
            if (elem.setSelectionRange) {
                elem.setSelectionRange(pos, pos);
                return;
            }
            if (elem.createTextRange) {
                let range = elem.createTextRange();
                range.collapse(true);
                range.moveEnd("character", pos);
                range.moveStart("character", pos);
                range.select();
                return;
            }
        }
    }

    initializePhoneMask();
});

// Активируем или деактивируем кнопку формы записи на сервис
function toggleSubmitButton() {
    const checkbox = document.getElementById("privacyCheckbox");
    const submitButton = document.getElementById("submitButton");
    submitButton.disabled = !checkbox.checked;
}

// Валидация формы НАЧАЛО
// Проверка формы на запрещённые символы
function validateInput(inputField) {
    const forbiddenChars = /[&<>\"']/;
    return forbiddenChars.test(inputField.value)
        ? "Ошибка: недопустимые символы (&, <, >, \", ')."
        : "";
}

// Скрываем сообщение об ошибке в форме
function hideErrorMessage(errorSpan) {
    setTimeout(() => {
        if (errorSpan) {
            errorSpan.textContent = "";
        }
    }, 3000);
}

// Отображаем сообщение об ошибке в форме и проверяем отправку
function handleFormSubmit(event) {
    const inputFields = document.querySelectorAll(".form__input");
    const errorSpan = document.querySelector("#error-text");
    errorSpan.textContent = "";

    let hasErrors = false;
    let firstErrorField = null;

    inputFields.forEach((field) => {
        const errorMessage = validateInput(field);
        if (errorMessage) {
            errorSpan.textContent = errorMessage;
            hasErrors = true;
            if (!firstErrorField) {
                firstErrorField = field;
            }
        }
    });

    if (hasErrors) {
        event.preventDefault();
        hideErrorMessage(errorSpan);
        if (firstErrorField) {
            firstErrorField.focus();
        }
        return;
    }

    // Проверяем, может ли пользователь отправить форму повторно через 10 часов
    if (getCookie("formSubmitted") === "true") {
        event.preventDefault();
        return;
    }

    sendToWhatsapp();
    showConfirmationBanner();

    // Устанавливаем куки на 10 часов ////////////////////////////////////////
    // setCookie("formSubmitted", "true", 0.41667); // 10 часов = 10/24
    setCookie("formSubmitted", "true", 1 / 1440); // 1 минута от 1 дня
}

document.querySelector("#myForm").addEventListener("submit", handleFormSubmit);
// Валидация формы КОНЕЦ

// Отправляем данные формы на Whatsapp
function sendToWhatsapp() {
    const datetimepicker = document.getElementById("datetimepicker").value;
    const name = document.getElementById("name").value;
    const phone = document.getElementById("phone").value;
    const car = document.getElementById("car").value;
    const service = document.getElementById("service").value;

    const url =
        "https://wa.me/79529124138?text=" +
        "ЗАПИСЬ НА СЕРВИС" +
        "%0a" +
        "Дата и время: " +
        datetimepicker +
        "%0a" +
        "Имя: " +
        name +
        "%0a" +
        "Телефон: " +
        phone +
        "%0a" +
        "Марка авто: " +
        car +
        "%0a" +
        "Вид работ: " +
        service +
        "%0a" +
        "ПОЖАЛУЙСТА, ПОДТВЕРДИТЕ ЗАПИСЬ!";

    window.open(url, "_blank").focus();
}

// Появляется баннер подтверждения заявки
function showConfirmationBanner() {
    const confirmationBanner = document.getElementById("confirmation-banner");
    confirmationBanner.style.display = "flex";

    // Таймер убирает баннер через 10 часов ////////////////////////////////////////
    setTimeout(() => {
        confirmationBanner.style.display = "none";
        // }, 10 * 60 * 60 * 1000); // 10 часов
    }, 60 * 1000); // 1 минута
}

// // Возвращаемся к тому же месту страницы после отправки данных формы
// function setupScrollPosition() {
//     document.getElementById("myForm").onsubmit = function () {
//         const scrollPosition = window.scrollY;
//         localStorage.setItem("scrollPosition", scrollPosition);
//     };

//     window.onload = function () {
//         const scrollPosition = localStorage.getItem("scrollPosition");
//         if (scrollPosition) {
//             window.scrollTo(0, parseInt(scrollPosition, 10));
//             localStorage.removeItem("scrollPosition");
//         }
//     };
// }
// setupScrollPosition();
