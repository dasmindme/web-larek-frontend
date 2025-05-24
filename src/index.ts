import './scss/styles.scss';

// Получаем лоты с сервера
api.getLotList()
    .then(appData.setCatalog.bind(appData))
    .catch(err => {
        console.error(err);
    });