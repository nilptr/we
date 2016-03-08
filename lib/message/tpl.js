
var Handlebars = require('handlebars');

// toUserName fromUserName createTime

// Content
var textTpl = [
  '<xml>',
  '<ToUserName><![CDATA[{{toUserName}}]]></ToUserName>',
  '<FromUserName><![CDATA[{{fromUserName}}]]></FromUserName>',
  '<CreateTime>{{createTime}}</CreateTime>',
  '<MsgType><![CDATA[text]]></MsgType>',
  '<Content><![CDATA[{{content}}]]></Content>',
  '</xml>'
].join('');


// mediaId
var imageTpl = [
  '<xml>',
  '<ToUserName><![CDATA[{{toUserName}}]]></ToUserName>',
  '<FromUserName><![CDATA[{{fromUserName}}]]></FromUserName>',
  '<CreateTime>{{createTime}}</CreateTime>',
  '<MsgType><![CDATA[image]]></MsgType>',
  '<Image>',
  '<MediaId><![CDATA[{{mediaId}}]]></MediaId>',
  '</Image>',
  '</xml>'
].join('');


// mediaId
var voiceTpl = [
  '<xml>',
  '<ToUserName><![CDATA[{{toUserName}}]]></ToUserName>',
  '<FromUserName><![CDATA[{{fromUserName}}]]></FromUserName>',
  '<CreateTime>{{createTime}}</CreateTime>',
  '<MsgType><![CDATA[voice]]></MsgType>',
  '<Voice>',
  '<MediaId><![CDATA[{{mediaId}}]]></MediaId>',
  '</Voice>',
  '</xml>'
].join('');


// mediaId title description
var videoTpl = [
  '<xml>',
  '<ToUserName><![CDATA[{{toUserName}}]]></ToUserName>',
  '<FromUserName><![CDATA[{{fromUserName}}]]></FromUserName>',
  '<CreateTime>{{createTime}}</CreateTime>',
  '<MsgType><![CDATA[video]]></MsgType>',
  '<Video>',
  '<MediaId><![CDATA[{{mediaId}}]]></MediaId>',
  '<Title><![CDATA[{{title}}]]></Title>',
  '<Description><![CDATA[{{description}}]]></Description>',
  '</Video>',
  '</xml>'
].join('');


// title description musicUrl hqMusicUrl thumbMediaId
var musicTpl = [
  '<xml>',
  '<ToUserName><![CDATA[{{toUserName}}]]></ToUserName>',
  '<FromUserName><![CDATA[{{fromUserName}}]]></FromUserName>',
  '<CreateTime>{{createTime}}</CreateTime>',
  '<MsgType><![CDATA[music]]></MsgType>',
  '<Music>',
  '<Title><![CDATA[{{title}}]]></Title>',
  '<Description><![CDATA[{{description}}]]></Description>',
  '<MusicUrl><![CDATA[{{musicUrl}}]]></MusicUrl>',
  '<HQMusicUrl><![CDATA[{{hqMusicUrl}}]]></HQMusicUrl>',
  '<ThumbMediaId><![CDATA[{{thumbMediaId}}]]></ThumbMediaId>',
  '</Music>',
  '</xml>'
].join('');


// news[{title, description, picUrl, url}]
var newsTpl = [
  '<xml>',
  '<ToUserName><![CDATA[{{toUserName}}]]></ToUserName>',
  '<FromUserName><![CDATA[{{fromUserName}}]]></FromUserName>',
  '<CreateTime>{{createTime}}</CreateTime>',
  '<MsgType><![CDATA[news]]></MsgType>',
  '<ArticleCount>{{news.length}}</ArticleCount>',
  '<Articles>',
  '{{#each news}}',
  '<item>',
  '<Title><![CDATA[{{title}}]]></Title>',
  '<Description><![CDATA[{{description}}]]></Description>',
  '<PicUrl><![CDATA[{{picUrl}}]]></PicUrl>',
  '<Url><![CDATA[{{url}}]]></Url>',
  '</item>',
  '{{/each}}',
  '</Articles>',
  '</xml>'
].join('');

//var encryptWrap = [
//    '<xml>',
//        '<Encrypt><![CDATA[{{encryptMsg}}]]></Encrypt>',
//        '<MsgSignature><![CDATA[{{msgSignature}}]]></MsgSignature>',
//        '<TimeStamp>{{timeStamp}}</TimeStamp>',
//        '<Nonce><![CDATA[{{nonce}}]]></Nonce>',
//    '</xml>'
//].join('');

module.exports = {
  text: Handlebars.compile(textTpl),
  image: Handlebars.compile(imageTpl),
  voice: Handlebars.compile(voiceTpl),
  video: Handlebars.compile(videoTpl),
  music: Handlebars.compile(musicTpl),
  news: Handlebars.compile(newsTpl)
};