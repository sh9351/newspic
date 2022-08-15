const request = require('./request')
/**
 * 뉴스픽 파트너스 API
 * @module NewsPic
 */
class NewsPic {
    /**
     * 뉴스픽 파트너스 API 계정 정보를 설정합니다.
     * @param {String} id 뉴스픽 파트너스 API 계정 이메일 주소
     * @param {String} password 뉴스픽 파트너스 API 계정 비밀번호
     */
    constructor(id, password) {
        this.id = id
        this.password = password
    }
    /**
     * 뉴스픽 파트너스 API에 로그인합니다.
     * @returns {Promise}
     */
    login() {
        return new Promise(resolve => request({
            host: 'partners.newspic.kr',
            path: '/login?id=' + this.id + '&password=' + this.password,
            method: 'POST'
        }, (data, res) => {
            this.cookie = res.headers['set-cookie']
            resolve()
        }))
    }
    /**
     * fetchTrending 지난 1시간 동안 선호 카테고리에서 수익이 많이 발생된 콘텐츠를 반환합니다.
     * @param {Number} pageSize 불러올 콘텐츠의 개수
     * @returns {Promise} 지난 1시간 동안 선호 카테고리에서 수익이 많이 발생된 콘텐츠를 반환
     */
    fetchTrending(pageSize) {
        return new Promise(resolve => request({
            host: 'partners.newspic.kr',
            path: '/main/contentList?pageSize=' + pageSize,
            headers: { Cookie: this.cookie },
            method: 'POST'
        }, data => resolve(JSON.parse(data).contentList.map(i => new Article(i, this)))))
    }
    /**
     * fetchChannel 특정한 채널의 콘텐츠를 반환합니다.
     * @param {String} channelNo 불러올 콘텐츠의 채널
     * @param {Number} pageSize 불러올 콘텐츠의 개수
     * @returns {Promise} 특정한 채널의 콘텐츠를 반환
     */
    fetchChannel(channelNo, pageSize) {
        return new Promise(resolve => request({
            host: 'partners.newspic.kr',
            path: '/main/contentList?channelNo=' + channelNo + '&pageSize=' + pageSize,
            headers: { Cookie: this.cookie },
            method: 'POST'
        }, data => resolve(JSON.parse(data).contentList.map(i => new Article(i, this)))))
    }
    /**
    * fetchURL 콘텐츠의 공유용 주소를 반환합니다.
    * @param {Number} nid 주소를 생성할 콘텐츠의 nid
    * @returns {Promise} 콘텐츠의 공유용 주소를 반환
    */
    fetchURL(nid) {
        return new Promise(resolve => request({
            host: 'partners.newspic.kr',
            path: '/management/share/getShortUrl?queryString=%3Fnid=' + nid,
            headers: { Cookie: this.cookie }
        }, resolve))
    }
    /**
    * fetchSummary 콘텐츠의 3줄 요약을 반환합니다.
    * @param {Number} nid 요약할 콘텐츠의 nid
    * @returns {Promise} 콘텐츠의 3줄 요약을 반환
    */
    fetchSummary(nid) {
        return new Promise((resolve, reject) => request({
            host: 'm.newspic.kr',
            path: '/summary.html?nid=' + nid
        }, data => {
            try {
                resolve(decode(data.split('<div class="article_view">')[1].split('</div>')[0]).replace(/(<([^>]+)>)/gi, '').split('\n').map(l => l.trim()).filter(l => l))
            } catch (e) {
                reject(e)
            }
        }))
    }
}
/**
 * 뉴스픽 파트너스 글
 * @module Article
 */
class Article {
    constructor(article, NewsPic) {
        Object.keys(article).forEach(k => this[k] = article[k])
        this.fetchURL = () => NewsPic.fetchURL(article.nid)
        this.fetchSummary = () => NewsPic.fetchSummary(article.nid)
    }
}

const decode = encodedString => encodedString.replace(/&(nbsp|amp|quot|lt|gt);/g, (match, entity) => ({
    "nbsp": " ",
    "amp": "&",
    "quot": "\"",
    "lt": "<",
    "gt": ">"
}[entity])).replace(/&#(\d+);/gi, (match, numStr) => String.fromCharCode(parseInt(numStr, 10)))


module.exports = NewsPic
module.exports.Article = Article