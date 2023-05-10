let tmpRun = require('./bookstore-import-books.js')(
    (pError)=>
    {
        if (pError)
        {
            console.log(`ERROR: ${pError}`, pError);
        }
        process.exit();
    });