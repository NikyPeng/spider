/**
 * Created by glzc on 2018/1/17.
 */
module.exports = {
    makeUuid: () => {
        let d = new Date().getTime();
        let uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c){
            let r = (d + Math.random() * 16)%16 | 0;
            d = Math.floor(d/16);
            return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        })
        return uuid;
    },
    getDate: (n) => {
        let d = new Date();
        d.setDate(d.getDate() + n);
        /*let y = d.getFullYear(),
            m = (d.getMonth() + 1) < 10 ? '0' + (d.getMonth() + 1) : (d.getMonth() + 1),
            da = d.getDate() < 10 ? '0' + d.getDate() : d.getDate();*/
        return new Date(d)
    }
}