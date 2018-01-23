/**
 * Created by glzc on 2018/1/19.
 */
const mongoose = require('mongoose');

const houseSche = mongoose.Schema({
    house_id: {type: String, unique: true},
    title: String,
    page_url: String,
    img_url: String,
    rent_type: Number,              // 0-整租 1-合租
    orientation: String,            //朝向
    house_area: Number,             //面积
    house_room: Number,             //室
    house_hall: Number,             //厅
    floor: String,                  //楼层
    urban_area: String,             //城区
    street_scene: String,           //街道
    rent_price: Number,             //房租
    tags: String,                   //特色（0-精装修 1-家电齐全、2-押一付一、3-市政供暖、4-临近地铁、5-单身公寓、6-随时入住、7-交通便利、8-免中介费、9-首次出租、a-配套齐全、b-采光好）
    village: String,                //小区
    release_time: Number,             //发布时间
    agent: String,                  //经纪人
    agent_intr_url: String,         //经纪人介绍
    create_time: Number,
    update_time: Number,
});

const House = mongoose.model('House', houseSche);

module.exports = House;