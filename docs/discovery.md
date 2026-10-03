# Search discovery / 検索への公開

The English, Japanese and Thai catalogues each have their own URL. Thai research explanations are translated for this website; game label crops come from the identified Thai V1.2 patch and do not imply a complete Unicode decoding of its font.

The catalogue uses separate language URLs, self-canonical links, reciprocal `hreflang` links, descriptive titles, game names in visible headings, image alt text, structured page metadata and a [sitemap](../sitemap.xml). Initial HTML includes all catalogue cards, evidence notes and source links; JavaScript adds filtering and sorting rather than supplying the only readable content.

Regenerate the static content after changing catalogue data or the shared renderer:

```sh
node scripts/build_catalogue.cjs
```

This uses Node's standard libraries only. Generated HTML is committed with the source data. The title-screen image is provided by the project owner; original game art is not relicensed.

## Google indexing

These are discovery signals, not a promise of indexing, ranking or an indexing date. The project owner can add the GitHub Pages URL-prefix property in Google Search Console, verify ownership using Google's supplied method, submit the public `sitemap.xml` URL and use URL Inspection for each language page. Search Console verification has not been completed by this repository's publication scripts. An HTML verification file, if chosen, must use the exact value Google issues to the owner.

GitHub Pages serves this project below a path on `github.io`; the project does not control the host-root `/robots.txt`. The sitemap is directly available and can be submitted to Search Console without inventing a project-level robots policy.

言語別URL・canonical・相互hreflang・説明的なタイトル・サイトマップを設置し、JavaScript実行前のHTMLにも一覧を含めています。これらは検索エンジンの発見を助けますが、登録時期や順位を保証しません。Search Consoleの所有権確認・サイトマップ送信は所有者のアカウントで別途行う手順です。

Sources: [Google multilingual sites](https://developers.google.com/search/docs/specialty/international/managing-multi-regional-sites), [localized versions](https://developers.google.com/search/docs/specialty/international/localized-versions), [sitemaps](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap), [JavaScript SEO](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics).

หน้าอังกฤษ ญี่ปุ่น และไทยมี URL แยกกัน พร้อมชื่อหน้าและข้อมูลสำหรับค้นหา แต่ยังไม่ยืนยันว่า Google เก็บเข้าดัชนีแล้ว หรือจะได้อันดับใด การยืนยันเจ้าของเว็บใน Search Console และส่ง sitemap ยังเป็นขั้นตอนที่เจ้าของบัญชีต้องดำเนินการ
