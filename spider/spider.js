/**
 * Created by glzc on 2018/1/19.
 */
const cheerio = require('cheerio');
const superagent = require('superagent');
const utils = require('./../utils/utils');
const House = require('./../models/house/house');
//抓取http://zu.house.163.com/出租房信息   ?&page=1&size=20&xq=&keyword=&order=0&tag=0
class Spider{
    constructor(props){
        this.options = {
            host: props.host,
            uri: props.uri,
            page: props.page || 1,
            size: props.size || 20,
            pages: null,
            timeId: null,
        };
        this.turnPageSpider = this.turnPageSpider.bind(this);
        this._spider = this._spider.bind(this);
    }
    turnPageSpider(){
        console.log('*****', this.options.pages);
        this._spider();
        this.options.page++;
        if(this.options.pages && this.options.page > this.options.pages){
            this.options.pages = null;
            clearTimeout(this.options.timeId);
        }else{
            this.options.timeId = setTimeout(() => {
                this.turnPageSpider();
            }, 10000);
        }
    }
    _spider(){
        console.log('=====', this.options.page);
        superagent
            .get(this.options.host + this.options.uri)
            .query({page: this.options.page, size: this.options.size, xq: '', keyword: '', order: 0, tag: 0})
            .then((res) => {
                const $ = cheerio.load(res.text);
                if(!this.options.pages || this.options.pages === 0){
                    let pages = $(".house-pagination>a");
                    this.options.pages = $(pages[pages.length - 2]).text();
                }
                const houses = $('.house-list>li');
                houses.map(async (i,v,arr) => {
                    let data = {};
                    data.page_url = this.options.host + $(v).find('.house-img>a').attr('href');
                    data.house_id = data.page_url.match(/\/[a-zA-Z0-9]+(?=\.html)/g)[0].slice(1);
                    data.img_url = $(v).find('.house-img>a>img').attr('src');
                    data.rent_price = $(v).find('.house-rent-price>span').text();
                    data.title = $(v).find('.house-info-wrap>h4').attr('title');
                    let house_words = $(v).find('.house-words')
                    let house_words_infos = $(house_words[0]).find('.house-word'),
                        house_addr = $(house_words[1]).find('.house-word');
                    data.rent_type = $(house_words_infos[0]).text() === "整租" ? 0 : 1;
                    data.house_area = parseFloat($(house_words_infos[house_words_infos.length > 5 ? 2 : 1]).text());
                    data.orientation = $(house_words_infos[house_words_infos.length > 5 ? 3 : 2]).text()
                    let room_hall = $(house_words_infos[house_words_infos.length > 5 ? 4 : 3]).text().match(/\d/g);
                    data.house_room = room_hall && room_hall.length > 0 ? room_hall[0] : 0;
                    data.house_hall = room_hall && room_hall.length > 1 ? room_hall[1] : 0;
                    data.floor = $(house_words_infos[house_words_infos.length > 5 ? 5 : 4]).text();
                    data.village = $(house_addr[0]).text();
                    let addr = $(house_addr[1]).text().split('-');
                    data.urban_area = addr.length > 0 ? addr[0] : '';
                    data.street_scene = addr.length > 1 ? addr[1] : '';
                    let timeAgo = $(v).find('.house-agent-info>span').text();
                    let release_time = timeAgo.indexOf('前') > -1 ? parseInt(timeAgo) + 1 : timeAgo.indexOf('昨天') > -1 ? 1 : 0 ;       //发布时间
                    data.release_time = utils.getDate(release_time);
                    let agent = $(v).find('.house-agent-info>a>span').text().split('-');
                    data.agent = agent.length > 1 ? agent[1] : '';
                    data.agent_intr_url = this.options.host + $(v).find('.house-agent-info>a').attr('href');
                    let house_specials = $(v).find('.house-specials>.house-special');
                    let house_specials_v = [];
                    if(house_specials && house_specials.length > 0){
                        house_specials.map((idx, val, hs) => {
                            house_specials_v.push($(val).text());
                        });
                    }
                    data.tags = (house_specials_v && house_specials_v.length > 0) ? house_specials_v.join(';') : '';
                    //console.log(data);
                    try{
                        const house = await House.findOne({house_id: data.house_id});
                        if(!house){
                            data.create_time = new Date().getTime();
                            data.update_time = new Date().getTime();
                            House.create(data);
                        }else if(house.release_time !== data.release_time){
                            data.update_time = new Date().getTime();
                            House.update(data);
                        }
                    }catch(e){
                        console.log('======', e);
                    }
                })
            })
    }
}

module.exports = (options) => new Spider(options);
