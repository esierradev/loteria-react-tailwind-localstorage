import Swal from 'sweetalert2'

export const showMessage = ({ title, text, icon }) => {
    Swal.fire({
        title,
        text,
        icon,
        confirmButtonText: 'Aceptar',
        background: '#56a933',
        color: '#000000',
        confirmButtonColor: '#3085d6',
    });
}

export const showValidationMessage = ({ title, text, icon }) => {
    return Swal.fire({
        title,
        text,
        icon,
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sí, desmarcar",
        cancelButtonText: "Cancelar",
        background: '#56a933',
        color: '#000000'
    });
};
