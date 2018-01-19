/**
 * Created by glzc on 2018/1/19.
 */
const cheerio = require('cheerio');
const superagent = require('superagent');
const utils = require('./../utils/utils');
//抓取http://zu.house.163.com/出租房信息   ?&page=1&size=20&xq=&keyword=&order=0&tag=0
class Spider{
    constructor(props){
        this.options = {
            host: props.host,
            uri: props.uri,
            page: props.page || 1,
            size: props.size || 20,
            pages: null,
        };
        this.getUrl = this.getUrl;
        this._spider = this._spider;
    }
    getUrl(){
        console.log('*****', this.options.url)
    }
    async _spider(){
        superagent
            .get(this.options.host + this.options.uri)
            .query({page: this.options.page, size: this.options.size, xq: '', keyword: '', order: 0, tag: 0})
            .then((res) => {
                const $ = cheerio.load(res.text);
                if(!this.options.pages){
                    let pages = $(".house-pagination>a");
                    this.options.pages = pages[pages.length - 2].children.data
                }
                const houses = $('.house-list>li');
                //console.log($(houses[0]).find('.house-img>a').attr('href'))
                houses.map((i,v,arr) => {
                    let data = {};
                    data.page_url = this.options.host + $(v).find('.house-img>a').attr('href');
                    data.house_id = data.page_url.match(/\/[a-zA-Z0-9]+(?=\.html)/g)[0].slice(1);
                    data.img_url = $(v).find('.house-img>a>img').attr('src');
                    data.rent_price = $(v).find('.house-rent-price>span').html();
                    data.title = $(v).find('.house-info-wrap>h4').attr('title');
                    let house_words = $(v).find('.house-words')
                    let house_words_infos = $(house_words[0]).find('.house-word'),
                        house_addr = $(house_words[1]).find('.house-word');
                    data.rent_type = $(house_words_infos[0]).html() === "整租" ? 0 : 1;
                    data.house_area = parseFloat($(house_words_infos[1]).html());
                    data.orientation = $(house_words_infos[2]).html()
                    let room_hall = $(house_words_infos[3]).html().match(/\d/g);
                    data.house_room = room_hall.length > 0 ? room_hall[0] : 0;
                    data.house_hall = room_hall.length > 1 ? room_hall[1] : 0;
                    data.floor = $(house_words_infos[4]).html();
                    data.village = $(house_addr[0]).html();
                    let addr = $(house_addr[1]).html().split('-');
                    data.urban_area = addr.length > 0 ? addr[0] : '';
                    data.street_scene = addr.length > 1 ? addr[1] : '';
                    let timeAgo = $(v).find('.house-agent-info>span').html();
                    let release_time = timeAgo.indexOf('前') > -1 ? parseInt(timeAgo) + 1 : timeAgo.indexOf('昨天') > -1 ? 1 : 0 ;       //发布时间
                    data.release_time = utils.getDate(release_time);
                    let agent = $(v).find('.house-agent-info>a>span').html().split('-');
                    data.agent = agent.length > 1 ? agent[1] : '';
                    data.agent_intr_url = this.options.host + $(v).find('.house-agent-info>a').attr('href');
                    let house_specials = $(v).find('.house-specials>.house-special');
                    let house_specials_v = null;
                    if(house_specials && house_specials.length > 0){
                        house_specials_v = house_specials.map(v => $(v).html());
                    }
                    data.tags = (house_specials_v && house_specials_v.length > 0) ? house_specials_v.join(';') : '';
                    //console.log(data);
                })
            })
    }
}

module.exports = (options) => new Spider(options);
