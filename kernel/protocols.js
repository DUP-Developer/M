
let protocols = {
    list: [],
    runner: () => {
        fetch(list).then( (it) => require(it) )
    }
}