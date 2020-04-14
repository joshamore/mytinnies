const getters = {
    getTinnies = function() {
        const url = "localhost:5000/api/getTinnies";

        fetch(url).then(res => {
            console.log(res);
        }).catch(e => console.log(e.message));
    }
}   