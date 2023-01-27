if (localStorage.getItem('theme') === 'white') {
    document.body.classList.toggle('white');
    document.querySelector('#toggleMoon').classList.toggle('hidden');
    document.querySelector('#toggleSun').classList.toggle('hidden');
}