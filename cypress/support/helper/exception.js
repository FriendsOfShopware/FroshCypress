Cypress.on('uncaught:exception', (err, runnable) => {
    console.log(err);

    // Stupid Extjs, Tinymce error
    if (err.message === 'Cannot read property \'body\' of undefined') {
        return false;
    }
});
