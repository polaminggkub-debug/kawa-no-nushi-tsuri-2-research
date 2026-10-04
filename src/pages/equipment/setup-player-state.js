import { player_th } from './player_th.js'
import { player_en } from './player_en.js'
import { player_ja } from './player_ja.js'
export function setupPlayerState(ctx) {
  ctx.allItems = []
  ctx.player = { th: player_th, en: player_en, ja: player_ja }[ctx.lang]
  ctx.cardUi =
    ctx.lang === 'th'
      ? {
          decisionDetails: 'เหตุผลและตัวเลือกที่เปรียบเทียบ',
          useDetails: 'รายละเอียดการใช้',
          moreActions: 'ทางเลือกอื่นในการหาและใช้',
          buying: 'แหล่งซื้อ',
          fish: (n) => `ปลาที่ผ่านเงื่อนไข · ${n}`,
          categoryAdvice: (n) => `คำแนะนำของหมวดนี้ · ${n} ส่วน`,
          fullRecommendation: 'คำแนะนำฉบับเต็ม',
          details: 'ดูรายละเอียดไอเท็ม',
          noDecision: 'ข้อมูลการใช้งานเพิ่มเติม',
        }
      : ctx.lang === 'ja'
        ? {
            decisionDetails: '判断理由と比較候補',
            useDetails: '使い方の詳細',
            moreActions: '入手・使用の追加情報',
            buying: '販売場所',
            fish: (n) => `判定を通る魚 · ${n}`,
            categoryAdvice: (n) => `この種類の選び方 · ${n}項目`,
            fullRecommendation: '詳しい選択案内',
            details: '道具の詳細を見る',
            noDecision: '追加の使い方',
          }
        : {
            decisionDetails: 'Why and what to compare',
            useDetails: 'More about using this item',
            moreActions: 'Other ways to get or use it',
            buying: 'Where to buy',
            fish: (n) => `Fish passing the check · ${n}`,
            categoryAdvice: (n) => `Choices for this category · ${n} sections`,
            fullRecommendation: 'Full recommendation',
            details: 'Open item details',
          }
  ctx.groups = ['rod', 'lure', 'flymaker', 'bait', 'hook', 'float_weight', 'food', 'general_tool']
  ctx.fishVisuals = {}
}
