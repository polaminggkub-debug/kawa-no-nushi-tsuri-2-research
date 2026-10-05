const categoryAdvice = {
  th: {
    all: 'ป้ายเงื่อนไขปลามีเฉพาะเหยื่อจริง ลัวร์ และบอดี้ฟลาย: ดูป้ายก่อนซื้อ การผ่านเงื่อนไขไม่รับประกันว่าปลากินหรือตกขึ้นได้ ของหมวดอื่นให้ดูคำแนะนำการใช้ในรายละเอียด',
    rod: 'เลือกคันตามวิธีตกที่ใช้ แล้วเปรียบเทียบเวลาเล็ง ขอบเขตระยะ และราคาในรายละเอียดคันก่อนซื้อ',
    hook: 'เลือกเบ็ดให้ตรงกับชุดที่ใช้ แล้วดูคำแนะนำและราคาในรายละเอียดไอเท็มก่อนซื้อ',
    float_weight: 'เลือกทุ่นหรือตะกั่วตามชุดที่ใช้ แล้วเปรียบเทียบราคาและคำแนะนำในรายละเอียดไอเท็ม',
    food: 'เลือกอาหารตาม HP ที่ต้องเติมและราคา เปิดรายละเอียดเพื่อดู HP ที่ฟื้นและเงื่อนไขเควสต์ก่อนกิน',
    general_tool:
      'ซื้อเมื่อจำเป็นต้องใช้ทำสิ่งนั้นหรือทำเควสต์ เปิดรายละเอียดเพื่อดูว่าใช้ที่ไหนและต้องเก็บไว้ทำอะไร',
    fly_wing:
      'รายการนี้เป็นส่วนประกอบของฟลายสำเร็จรูปที่ร้านขาย เปิดรายละเอียดเพื่อดูทั้งชุดก่อนซื้อ',
    fly_tail:
      'รายการนี้เป็นส่วนประกอบของฟลายสำเร็จรูปที่ร้านขาย เปิดรายละเอียดเพื่อดูทั้งชุดก่อนซื้อ',
    fallback: 'เปิดรายละเอียดไอเท็มเพื่อดูวิธีใช้และเหตุผลที่ควรซื้อ',
  },
  en: {
    all: 'Fish-check badges apply to bait, lures and fly bodies. Check them before buying; passing does not guarantee a bite or landing. For other categories, read the use advice in item details.',
    rod: 'Choose a rod for your fishing method, then compare aiming time, reach threshold and price in rod details before buying.',
    hook: 'Choose a hook for your setup, then check its use advice and price in item details before buying.',
    float_weight:
      'Choose a float or sinker for your setup, then compare prices and use advice in item details.',
    food: 'Choose food by the HP you need to restore and its price. Open details for measured HP recovery and quest conditions before eating.',
    general_tool:
      'Buy a tool when you need its action or quest use. Open details to see where to use it and what to keep it for.',
    fly_wing:
      'These components belong to ready-made fly bundles sold here. Open details to inspect the whole bundle before buying.',
    fly_tail:
      'These components belong to ready-made fly bundles sold here. Open details to inspect the whole bundle before buying.',
    fallback: 'Open item details for its use and buying advice.',
  },
  ja: {
    all: '魚の判定表示はエサ・ルアー・毛バリのボディに付きます。購入前に確認してください。判定を通っても食いつきや取り込みは保証されません。他の種類は詳細ページの使い方で選んでください。',
    rod: '釣り方に合う竿を選び、竿の詳細で照準時間・距離の境界値・価格を比較してから購入してください。',
    hook: '仕掛けに合う針を選び、詳細ページで使い方と価格を確認してから購入してください。',
    float_weight: '仕掛けに合うウキやオモリを選び、詳細ページで価格と使い方を比較してください。',
    food: '回復したいHPと価格で食べ物を選んでください。食べる前に詳細ページで確認済みの回復量とイベント用途を確認してください。',
    general_tool:
      '必要な操作やイベント用途がある時に購入してください。詳細ページで使う場所と取っておく用途を確認できます。',
    fly_wing:
      'ここでは店で販売する完成毛バリの構成部品を表示します。購入前に詳細ページでセット全体を確認してください。',
    fly_tail:
      'ここでは店で販売する完成毛バリの構成部品を表示します。購入前に詳細ページでセット全体を確認してください。',
    fallback: '詳細ページで使い方と購入の判断材料を確認してください。',
  },
}

export function shopCategoryGuidance(lang, category, compatibilityAdvice) {
  const copy = categoryAdvice[lang] || categoryAdvice.en
  const hasFishChecks = ['all', 'bait', 'lure', 'fly'].includes(category)
  const text = ['bait', 'lure', 'fly'].includes(category)
    ? compatibilityAdvice
    : copy[category] || copy.fallback
  return { text, state: hasFishChecks ? 'shown' : 'not-applicable' }
}
