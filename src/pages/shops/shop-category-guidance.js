const categoryAdvice = {
  th: {
    all: 'ป้ายบอกปลามีเฉพาะเหยื่อจริง ลัวร์ และบอดี้ฟลาย: ดูป้ายก่อนซื้อว่าปลาเป้าหมายกินชิ้นนั้นไหม ฟลายยังต้องไม่ติดล็อกของเซฟ ของหมวดอื่นให้ดูคำแนะนำการใช้ในรายละเอียด',
    rod: 'เลือกวิธีตกก่อน แล้วดูคำแนะนำซื้อใต้คันแต่ละรุ่นของด่านนี้ เทียบราคา เวลาเล็ง สายขาดยาก และจุดเริ่มสู้ ปลาใหญ่ต้องใช้คันที่สายยาว',
    hook: 'เลือกเบ็ดตามขนาดปลาที่จะตก ดูว่าเหมาะกับปลาแบบไหนและราคาในรายละเอียดไอเท็มก่อนซื้อ ขายเป็นชุด 9 ตัว',
    float_weight:
      'ทุ่นทุกแบบให้ผลเท่ากัน ซื้อตัวที่ถูกสุด ตะกั่วใช้กับคันหวดเท่านั้น ดูรายละเอียดไอเท็มก่อนซื้อ',
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
    all: 'Fish badges apply to bait, lures and fly bodies. Check whether your target fish takes the item before buying; a fly must also get past the save’s lock. For other categories, read the use advice in item details.',
    rod: 'Choose your fishing method, then read each rod’s buying advice for this area. The comparison covers price, time to aim, line strength and fight start; big fish need a rod with a long line.',
    hook: 'Choose a hook by the size of the fish you want, then check which fish it suits and its price in item details. Hooks are sold in stacks of 9.',
    float_weight:
      'Every float does the same, so buy the cheapest. Sinkers are for casting rods only. Check item details before buying.',
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
    all: '魚の表示はエサ・ルアー・毛バリのボディに付きます。購入前に、狙う魚がその品を食べるか確認してください。毛バリはセーブのロックも通る必要があります。他の種類は詳細ページの使い方で選んでください。',
    rod: '釣り方を選び、このエリアの各竿の購入アドバイスを確認してください。比べるのは価格・狙う時間・糸の切れにくさ・ファイトの出だしで、大物には糸の長い竿が必要です。',
    hook: '狙う魚の大きさで針を選び、詳細ページでどの魚に向くかと価格を確認してから購入してください。9個1組で売っています。',
    float_weight:
      'どのウキも効果は同じなので最安のものを買います。オモリは投げ竿専用です。購入前に詳細ページを確認してください。',
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
