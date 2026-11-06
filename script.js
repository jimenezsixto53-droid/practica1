(function () {
    'use strict';

    // Marca que JavaScript está activo: sin JS el menú queda siempre visible.
    document.documentElement.classList.add('js');

    /* ---------- Menú desplegable accesible (WCAG 2.1.1 y 4.1.2) ---------- */
    var boton = document.getElementById('menu-boton');
    var lista = document.getElementById('menu-lista');

    function abrirMenu(abrir) {
        lista.classList.toggle('abierto', abrir);
        boton.setAttribute('aria-expanded', String(abrir));
    }

    if (boton && lista) {
        boton.addEventListener('click', function () {
            abrirMenu(boton.getAttribute('aria-expanded') !== 'true');
        });

        // Esc cierra el menú y devuelve el foco al botón
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && boton.getAttribute('aria-expanded') === 'true') {
                abrirMenu(false);
                boton.focus();
            }
        });
    }

    /* ---------- Validación accesible del formulario (WCAG 3.3.1) ---------- */
    var form = document.getElementById('datos');

    if (form) {
        var estado = document.getElementById('estado');
        form.noValidate = true; // sin JS se usa la validación nativa del navegador

        function mensaje(campo) {
            var v = campo.validity;
            if (v.valueMissing) {
                return campo.getAttribute('data-vacio') || 'Este campo es obligatorio.';
            }
            if (v.typeMismatch || v.patternMismatch) {
                return campo.getAttribute('data-formato') || 'El formato no es válido.';
            }
            if (v.rangeUnderflow || v.rangeOverflow) {
                return campo.getAttribute('data-rango') || 'El valor está fuera del rango permitido.';
            }
            return '';
        }

        function validar(campo) {
            var texto = mensaje(campo);
            var aviso = document.getElementById(campo.id + '-error');
            // El error se indica con texto (no solo con color)
            aviso.textContent = texto ? 'Error: ' + texto : '';
            if (texto) {
                campo.setAttribute('aria-invalid', 'true');
            } else {
                campo.removeAttribute('aria-invalid');
            }
            return texto === '';
        }

        form.addEventListener('submit', function (e) {
            e.preventDefault();
            var campos = form.querySelectorAll('.campo input, .campo textarea');
            var primero = null;
            var total = 0;

            for (var i = 0; i < campos.length; i++) {
                if (!validar(campos[i])) {
                    total++;
                    if (!primero) {
                        primero = campos[i];
                    }
                }
            }

            estado.classList.toggle('con-error', total > 0);
            if (total > 0) {
                estado.textContent = 'Error: hay ' + total + (total === 1 ? ' campo' : ' campos') + ' por corregir.';
                primero.focus();
            } else {
                estado.textContent = 'Formulario enviado correctamente (demostración: los datos no se guardan).';
                form.reset();
            }
        });

        // Al corregir un campo con error, se vuelve a validar al escribir
        form.addEventListener('input', function (e) {
            if (e.target.getAttribute('aria-invalid')) {
                validar(e.target);
            }
        });
    }
})();
