document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("contactForm");
    const statusBox = document.getElementById("status-message");

    // Dynamic label lookup: extracts title from matching <label for="...">
    function getFieldLabelText(fieldId) {
        const label = document.querySelector(`label[for="${fieldId}"]`);
        return label ? label.textContent.trim() : fieldId;
    }

    // Check calendar validity for dd/mm/yyyy format
    function isValidCalendarDate(dateStr) {
        const match = dateStr.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
        if (!match) return false;

        const day = parseInt(match[1], 10);
        const month = parseInt(match[2], 10) - 1; // Months are 0-indexed in JS
        const year = parseInt(match[3], 10);

        const d = new Date(year, month, day);
        return (
            d.getFullYear() === year &&
            d.getMonth() === month &&
            d.getDate() === day
        );
    }

    // Validator rules mapped to input IDs
    const fieldValidators = {
        surname: function (val) {
            if (!val || val.length < 3) return "must contain at least 3 characters";
            return null;
        },
        firstname: function (val) {
            if (!val || val.length < 3) return "must contain at least 3 characters";
            return null;
        },
        address: function (val) {
            if (!val || val.length < 3) return "must contain at least 3 characters";
            if (!/\d/.test(val)) return "must contain at least one digit";
            if (/[@#$%^&*]/.test(val)) return "cannot contain characters: @, #, $, %, ^, &, *";
            return null;
        },
        birthdate: function (val) {
            if (!isValidCalendarDate(val)) return "must be a valid date formatted as dd/mm/yyyy";
            return null;
        },
        phone: function (val) {
            if (!/^\d{10}$/.test(val)) return "must be 10 digits (e.g. 0765281725)";
            return null;
        },
        email: function (val) {
            const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
            if (!pattern.test(val)) return "must be a valid email address";
            return null;
        }
    };

    // Validates an input and changes its background to orange or resets it
    function validateInput(input) {
        const validator = fieldValidators[input.id];
        if (!validator) return null;

        const error = validator(input.value.trim());

        if (error) {
            input.classList.add("field-error");
            input.style.backgroundColor = "orange";
        } else {
            input.classList.remove("field-error");
            input.style.backgroundColor = "";
        }

        return error;
    }

    // Attach onblur listeners dynamically
    Object.keys(fieldValidators).forEach(function (id) {
        const input = document.getElementById(id);
        if (input) {
            input.addEventListener("blur", function () {
                validateInput(input);
            });
        }
    });

    // Submit listener
    if (form) {
        form.addEventListener("submit", function (e) {
            e.preventDefault();

            const errors = [];

            Object.keys(fieldValidators).forEach(function (id) {
                const input = document.getElementById(id);
                if (input) {
                    const err = validateInput(input);
                    if (err) {
                        const labelText = getFieldLabelText(id);
                        errors.push(`<strong>${labelText}</strong> ${err}`);
                    }
                }
            });

            if (statusBox) {
                if (errors.length > 0) {
                    statusBox.className = "error";
                    statusBox.style.display = "block";
                    statusBox.innerHTML = "<strong>Please correct the following fields:</strong><br>• " + errors.join("<br>• ");
                } else {
                    statusBox.className = "success";
                    statusBox.style.display = "block";
                    statusBox.innerHTML = "<strong>Confirmation:</strong> All fields are completed correctly! Form submitted.";
                }
            }
        });

        // Reset listener
        form.addEventListener("reset", function () {
            if (statusBox) {
                statusBox.textContent = "";
                statusBox.className = "";
                statusBox.style.display = "none";
            }

            Object.keys(fieldValidators).forEach(function (id) {
                const input = document.getElementById(id);
                if (input) {
                    input.classList.remove("field-error");
                    input.style.backgroundColor = "";
                }
            });
        });
    }
});



const USER = "admin", PASS = "admin1234";

const chat = document.getElementById("chat");
const msg = document.getElementById("chat-msg");
const user = document.getElementById("chat-user");
const pass = document.getElementById("chat-pass");
const fields = chat.querySelectorAll("input, button");

document.getElementById("chat-head").onclick = () => chat.classList.add("open");
document.getElementById("chat-icon").onclick = e => {
    e.stopPropagation();
    chat.classList.toggle("open");
};
document.getElementById("chat-close").onclick = e => {
    e.stopPropagation();
    chat.classList.remove("open");
};

document.getElementById("chat-btn").onclick = () => {
    fields.forEach(f => f.disabled = true);
    chat.classList.add("busy");

    setTimeout(() => {
        const ok = user.value === USER && pass.value === PASS;
        msg.className = ok ? "" : "err";
        msg.innerHTML = ok
            ? '<i class="ic ic-check"></i> Authentication successfull !'
            : '<i class="ic ic-warn"></i> Invalid username or password';
        fields.forEach(f => f.disabled = ok);
        chat.classList.remove("busy");
    }, 3000);
};