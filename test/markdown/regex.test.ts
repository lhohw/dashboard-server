import { describe, test, expect } from "bun:test";
import {
  commentRegex,
  referenceRegex,
  inlineStyleRegex,
  imgRegex,
  linkRegex,
  inlineStylePropertyRegex,
  specialCharRegex,
  JSXStyleRegex,
  JSXStylePropertyRegex,
  mdRegex,
  charRegex,
  titleRegex,
  numberRegex,
  englishLowerRegex,
  englishUpperRegex,
  koreanRegex,
  spaceRegex,
  srcRegex,
  base64SrcRegex,
  altRegex,
  headingRegex,
  frontmatterRegex,
} from "const/regex";
import { parseFrontmatterToMap, parseJSXStyleStringToMap } from "utils/regex";

describe("primitive pattern", () => {
  describe("number", () => {
    test("a0123456789-", () => {
      let str, matched, matchedStr;
      const regex = new RegExp(`[${numberRegex.source}]+`);

      str = "a0123456789-";
      matched = str.match(regex);
      expect(matched).not.toBeNull();

      [matchedStr] = matched!;
      expect(matchedStr).toBe("0123456789");
    });
  });

  describe("english lower", () => {
    test("AB@abcdefghijklmnopqrstuvwxyz!YZ", () => {
      let str, matched, matchedStr;
      const regex = new RegExp(`[${englishLowerRegex.source}]+`);

      str = "AB@abcdefghijklmnopqrstuvwxyz!YZ";
      matched = str.match(regex);
      expect(matched).not.toBeNull();

      [matchedStr] = matched!;
      expect(matchedStr).toBe("abcdefghijklmnopqrstuvwxyz");
    });
  });

  describe("english upper", () => {
    test("ab@ABCDEFGHIJKLMNOPQRSTUVWXYZ!123", () => {
      let str, matched, matchedStr;
      const regex = new RegExp(`[${englishUpperRegex.source}]+`);

      str = "ab@ABCDEFGHIJKLMNOPQRSTUVWXYZ!123";
      matched = str.match(regex);
      expect(matched).not.toBeNull();

      [matchedStr] = matched!;
      expect(matchedStr).toBe("ABCDEFGHIJKLMNOPQRSTUVWXYZ");
    });
  });

  describe("korean", () => {
    test("완성형 한글", () => {
      let str, matched, matchedStr;
      const regex = new RegExp(`[${koreanRegex.source}]+`);

      str =
        "111가각간갇갈갉갊감갑값갓갔강갖갗같갚갛개객갠갤갬갭갯갰갱갸갹갼걀걋걍걔걘걜거걱건걷걸걺검겁것겄겅겆겉겊겋게겐겔겜겝겟겠겡겨격겪견겯결겸겹겻겼경곁계곈곌곕곗고곡곤곧골곪곬곯곰곱곳공곶과곽관괄괆괌괍괏광괘괜괠괩괬괭괴괵괸괼굄굅굇굉교굔굘굡굣구국군굳굴굵굶굻굼굽굿궁궂궈궉권궐궜궝궤궷귀귁귄귈귐귑귓규균귤그극근귿글긁금급긋긍긔기긱긴긷길긺김깁깃깅깆깊까깍깎깐깔깖깜깝깟깠깡깥깨깩깬깰깸깹깻깼깽꺄꺅꺌꺼꺽꺾껀껄껌껍껏껐껑께껙껜껨껫껭껴껸껼꼇꼈꼍꼐꼬꼭꼰꼲꼴꼼꼽꼿꽁꽂꽃꽈꽉꽐꽜꽝꽤꽥꽹꾀꾄꾈꾐꾑꾕꾜꾸꾹꾼꿀꿇꿈꿉꿋꿍꿎꿔꿜꿨꿩꿰꿱꿴꿸뀀뀁뀄뀌뀐뀔뀜뀝뀨끄끅끈끊끌끎끓끔끕끗끙끝끼끽낀낄낌낍낏낑나낙낚난낟날낡낢남납낫났낭낮낯낱낳내낵낸낼냄냅냇냈냉냐냑냔냘냠냥너넉넋넌널넒넓넘넙넛넜넝넣네넥넨넬넴넵넷넸넹녀녁년녈념녑녔녕녘녜녠노녹논놀놂놈놉놋농높놓놔놘놜놨뇌뇐뇔뇜뇝뇟뇨뇩뇬뇰뇹뇻뇽누눅눈눋눌눔눕눗눙눠눴눼뉘뉜뉠뉨뉩뉴뉵뉼늄늅늉느늑는늘늙늚늠늡늣능늦늪늬늰늴니닉닌닐닒님닙닛닝닢다닥닦단닫달닭닮닯닳담답닷닸당닺닻닿대댁댄댈댐댑댓댔댕댜더덕덖던덛덜덞덟덤덥덧덩덫덮데덱덴델뎀뎁뎃뎄뎅뎌뎐뎔뎠뎡뎨뎬도독돈돋돌돎돐돔돕돗동돛돝돠돤돨돼됐되된될됨됩됫됬됴두둑둔둘둠둡둣둥둬뒀뒈뒝뒤뒨뒬뒵뒷뒹듀듄듈듐듕드득든듣들듦듬듭듯등듸디딕딘딛딜딤딥딧딨딩딪따딱딴딸땀땁땃땄땅땋때땍땐땔땜땝땟땠땡떠떡떤떨떪떫떰떱떳떴떵떻떼떽뗀뗄뗌뗍뗏뗐뗑뗘뗬또똑똔똘똥똬똴뙈뙤뙨뚜뚝뚠뚤뚫뚬뚱뛔뛰뛴뛸뜀뜁뜅뜨뜩뜬뜯뜰뜸뜹뜻띄띈띌띔띕띠띤띨띰띱띳띵라락란랄람랍랏랐랑랒랖랗래랙랜랠램랩랫랬랭랴략랸럇량러럭런럴럼럽럿렀렁렇레렉렌렐렘렙렛렝려력련렬렴렵렷렸령례롄롑롓로록론롤롬롭롯롱롸롼뢍뢨뢰뢴뢸룀룁룃룅료룐룔룝룟룡루룩룬룰룸룹룻룽뤄뤘뤠뤼뤽륀륄륌륏륑류륙륜률륨륩륫륭르륵른를름릅릇릉릊릍릎리릭린릴림립릿링마막만많맏말맑맒맘맙맛망맞맡맣매맥맨맬맴맵맷맸맹맺먀먁먈먕머먹먼멀멂멈멉멋멍멎멓메멕멘멜멤멥멧멨멩며멱면멸몃몄명몇몌모목몫몬몰몲몸몹못몽뫄뫈뫘뫙뫼묀묄묍묏묑묘묜묠묩묫무묵묶문묻물묽묾뭄뭅뭇뭉뭍뭏뭐뭔뭘뭡뭣뭬뮈뮌뮐뮤뮨뮬뮴뮷므믄믈믐믓미믹민믿밀밂밈밉밋밌밍및밑바박밖밗반받발밝밞밟밤밥밧방밭배백밴밸뱀뱁뱃뱄뱅뱉뱌뱍뱐뱝버벅번벋벌벎범법벗벙벚베벡벤벧벨벰벱벳벴벵벼벽변별볍볏볐병볕볘볜보복볶본볼봄봅봇봉봐봔봤봬뵀뵈뵉뵌뵐뵘뵙뵤뵨부북분붇불붉붊붐붑붓붕붙붚붜붤붰붸뷔뷕뷘뷜뷩뷰뷴뷸븀븃븅브븍븐블븜븝븟비빅빈빌빎빔빕빗빙빚빛빠빡빤빨빪빰빱빳빴빵빻빼빽뺀뺄뺌뺍뺏뺐뺑뺘뺙뺨뻐뻑뻔뻗뻘뻠뻣뻤뻥뻬뼁뼈뼉뼘뼙뼛뼜뼝뽀뽁뽄뽈뽐뽑뽕뾔뾰뿅뿌뿍뿐뿔뿜뿟뿡쀼쁑쁘쁜쁠쁨쁩삐삑삔삘삠삡삣삥사삭삯산삳살삵삶삼삽삿샀상샅새색샌샐샘샙샛샜생샤샥샨샬샴샵샷샹섀섄섈섐섕서석섞섟선섣설섦섧섬섭섯섰성섶세섹센셀셈셉셋셌셍셔셕션셜셤셥셧셨셩셰셴셸솅소속솎손솔솖솜솝솟송솥솨솩솬솰솽쇄쇈쇌쇔쇗쇘쇠쇤쇨쇰쇱쇳쇼쇽숀숄숌숍숏숑수숙순숟술숨숩숫숭숯숱숲숴쉈쉐쉑쉔쉘쉠쉥쉬쉭쉰쉴쉼쉽쉿슁슈슉슐슘슛슝스슥슨슬슭슴습슷승시식신싣실싫심십싯싱싶싸싹싻싼쌀쌈쌉쌌쌍쌓쌔쌕쌘쌜쌤쌥쌨쌩썅써썩썬썰썲썸썹썼썽쎄쎈쎌쏀쏘쏙쏜쏟쏠쏢쏨쏩쏭쏴쏵쏸쐈쐐쐤쐬쐰쐴쐼쐽쑈쑤쑥쑨쑬쑴쑵쑹쒀쒔쒜쒸쒼쓩쓰쓱쓴쓸쓺쓿씀씁씌씐씔씜씨씩씬씰씸씹씻씽아악안앉않알앍앎앓암압앗았앙앝앞애액앤앨앰앱앳앴앵야약얀얄얇얌얍얏양얕얗얘얜얠얩어억언얹얻얼얽얾엄업없엇었엉엊엌엎에엑엔엘엠엡엣엥여역엮연열엶엷염엽엾엿였영옅옆옇예옌옐옘옙옛옜오옥온올옭옮옰옳옴옵옷옹옻와왁완왈왐왑왓왔왕왜왝왠왬왯왱외왹왼욀욈욉욋욍요욕욘욜욤욥욧용우욱운울욹욺움웁웃웅워웍원월웜웝웠웡웨웩웬웰웸웹웽위윅윈윌윔윕윗윙유육윤율윰윱윳융윷으윽은을읊음읍읏응읒읓읔읕읖읗의읜읠읨읫이익인일읽읾잃임입잇있잉잊잎자작잔잖잗잘잚잠잡잣잤장잦재잭잰잴잼잽잿쟀쟁쟈쟉쟌쟎쟐쟘쟝쟤쟨쟬저적전절젊점접젓정젖제젝젠젤젬젭젯젱져젼졀졈졉졌졍졔조족존졸졺좀좁좃종좆좇좋좌좍좔좝좟좡좨좼좽죄죈죌죔죕죗죙죠죡죤죵주죽준줄줅줆줌줍줏중줘줬줴쥐쥑쥔쥘쥠쥡쥣쥬쥰쥴쥼즈즉즌즐즘즙즛증지직진짇질짊짐집짓징짖짙짚짜짝짠짢짤짧짬짭짯짰짱째짹짼쨀쨈쨉쨋쨌쨍쨔쨘쨩쩌쩍쩐쩔쩜쩝쩟쩠쩡쩨쩽쪄쪘쪼쪽쫀쫄쫌쫍쫏쫑쫓쫘쫙쫠쫬쫴쬈쬐쬔쬘쬠쬡쭁쭈쭉쭌쭐쭘쭙쭝쭤쭸쭹쮜쮸쯔쯤쯧쯩찌찍찐찔찜찝찡찢찧차착찬찮찰참찹찻찼창찾채책챈챌챔챕챗챘챙챠챤챦챨챰챵처척천철첨첩첫첬청체첵첸첼쳄쳅쳇쳉쳐쳔쳤쳬쳰촁초촉촌촐촘촙촛총촤촨촬촹최쵠쵤쵬쵭쵯쵱쵸춈추축춘출춤춥춧충춰췄췌췐취췬췰췸췹췻췽츄츈츌츔츙츠측츤츨츰츱츳층치칙친칟칠칡침칩칫칭카칵칸칼캄캅캇캉캐캑캔캘캠캡캣캤캥캬캭컁커컥컨컫컬컴컵컷컸컹케켁켄켈켐켑켓켕켜켠켤켬켭켯켰켱켸코콕콘콜콤콥콧콩콰콱콴콸쾀쾅쾌쾡쾨쾰쿄쿠쿡쿤쿨쿰쿱쿳쿵쿼퀀퀄퀑퀘퀭퀴퀵퀸퀼큄큅큇큉큐큔큘큠크큭큰클큼큽킁키킥킨킬킴킵킷킹타탁탄탈탉탐탑탓탔탕태택탠탤탬탭탯탰탱탸턍터턱턴털턺텀텁텃텄텅테텍텐텔템텝텟텡텨텬텼톄톈토톡톤톨톰톱톳통톺톼퇀퇘퇴퇸툇툉툐투툭툰툴툼툽툿퉁퉈퉜퉤튀튁튄튈튐튑튕튜튠튤튬튱트특튼튿틀틂틈틉틋틔틘틜틤틥티틱틴틸팀팁팃팅파팍팎판팔팖팜팝팟팠팡팥패팩팬팰팸팹팻팼팽퍄퍅퍼퍽펀펄펌펍펏펐펑페펙펜펠펨펩펫펭펴편펼폄폅폈평폐폘폡폣포폭폰폴폼폽폿퐁퐈퐝푀푄표푠푤푭푯푸푹푼푿풀풂품풉풋풍풔풩퓌퓐퓔퓜퓟퓨퓬퓰퓸퓻퓽프픈플픔픕픗피픽핀필핌핍핏핑하학한할핥함합핫항핳해핵핸핼햄햅햇했행햐향허헉헌헐헒험헙헛헝헤헥헨헬헴헵헷헹혀혁현혈혐협혓혔형혜혠혤혭호혹혼홀홅홈홉홋홍홑화확환활홧황홰홱홴횃횅회획횐횔횝횟횡효횬횰횹횻후훅훈훌훑훔훗훙훠훤훨훰훵훼훽휀휄휑휘휙휜휠휨휩휫휭휴휵휸휼흄흇흉흐흑흔흖흗흘흙흠흡흣흥흩희흰흴흼흽힁히힉힌힐힘힙힛힝힣ㄱㄴㄷㄹㅁㅂㅅㅇㅈㅊㅋㅌㅍㅎㄲㄸㅃㅆㅉㄺㅀㄻㄼㅄㄳㄶㄵㄽㅏㅑㅓㅕㅗㅛㅜㅠㅡㅣㅒㅖ00000";
      matched = str.match(regex);
      expect(matched).not.toBeNull();

      [matchedStr] = matched!;
      expect(matchedStr).toBe(
        "가각간갇갈갉갊감갑값갓갔강갖갗같갚갛개객갠갤갬갭갯갰갱갸갹갼걀걋걍걔걘걜거걱건걷걸걺검겁것겄겅겆겉겊겋게겐겔겜겝겟겠겡겨격겪견겯결겸겹겻겼경곁계곈곌곕곗고곡곤곧골곪곬곯곰곱곳공곶과곽관괄괆괌괍괏광괘괜괠괩괬괭괴괵괸괼굄굅굇굉교굔굘굡굣구국군굳굴굵굶굻굼굽굿궁궂궈궉권궐궜궝궤궷귀귁귄귈귐귑귓규균귤그극근귿글긁금급긋긍긔기긱긴긷길긺김깁깃깅깆깊까깍깎깐깔깖깜깝깟깠깡깥깨깩깬깰깸깹깻깼깽꺄꺅꺌꺼꺽꺾껀껄껌껍껏껐껑께껙껜껨껫껭껴껸껼꼇꼈꼍꼐꼬꼭꼰꼲꼴꼼꼽꼿꽁꽂꽃꽈꽉꽐꽜꽝꽤꽥꽹꾀꾄꾈꾐꾑꾕꾜꾸꾹꾼꿀꿇꿈꿉꿋꿍꿎꿔꿜꿨꿩꿰꿱꿴꿸뀀뀁뀄뀌뀐뀔뀜뀝뀨끄끅끈끊끌끎끓끔끕끗끙끝끼끽낀낄낌낍낏낑나낙낚난낟날낡낢남납낫났낭낮낯낱낳내낵낸낼냄냅냇냈냉냐냑냔냘냠냥너넉넋넌널넒넓넘넙넛넜넝넣네넥넨넬넴넵넷넸넹녀녁년녈념녑녔녕녘녜녠노녹논놀놂놈놉놋농높놓놔놘놜놨뇌뇐뇔뇜뇝뇟뇨뇩뇬뇰뇹뇻뇽누눅눈눋눌눔눕눗눙눠눴눼뉘뉜뉠뉨뉩뉴뉵뉼늄늅늉느늑는늘늙늚늠늡늣능늦늪늬늰늴니닉닌닐닒님닙닛닝닢다닥닦단닫달닭닮닯닳담답닷닸당닺닻닿대댁댄댈댐댑댓댔댕댜더덕덖던덛덜덞덟덤덥덧덩덫덮데덱덴델뎀뎁뎃뎄뎅뎌뎐뎔뎠뎡뎨뎬도독돈돋돌돎돐돔돕돗동돛돝돠돤돨돼됐되된될됨됩됫됬됴두둑둔둘둠둡둣둥둬뒀뒈뒝뒤뒨뒬뒵뒷뒹듀듄듈듐듕드득든듣들듦듬듭듯등듸디딕딘딛딜딤딥딧딨딩딪따딱딴딸땀땁땃땄땅땋때땍땐땔땜땝땟땠땡떠떡떤떨떪떫떰떱떳떴떵떻떼떽뗀뗄뗌뗍뗏뗐뗑뗘뗬또똑똔똘똥똬똴뙈뙤뙨뚜뚝뚠뚤뚫뚬뚱뛔뛰뛴뛸뜀뜁뜅뜨뜩뜬뜯뜰뜸뜹뜻띄띈띌띔띕띠띤띨띰띱띳띵라락란랄람랍랏랐랑랒랖랗래랙랜랠램랩랫랬랭랴략랸럇량러럭런럴럼럽럿렀렁렇레렉렌렐렘렙렛렝려력련렬렴렵렷렸령례롄롑롓로록론롤롬롭롯롱롸롼뢍뢨뢰뢴뢸룀룁룃룅료룐룔룝룟룡루룩룬룰룸룹룻룽뤄뤘뤠뤼뤽륀륄륌륏륑류륙륜률륨륩륫륭르륵른를름릅릇릉릊릍릎리릭린릴림립릿링마막만많맏말맑맒맘맙맛망맞맡맣매맥맨맬맴맵맷맸맹맺먀먁먈먕머먹먼멀멂멈멉멋멍멎멓메멕멘멜멤멥멧멨멩며멱면멸몃몄명몇몌모목몫몬몰몲몸몹못몽뫄뫈뫘뫙뫼묀묄묍묏묑묘묜묠묩묫무묵묶문묻물묽묾뭄뭅뭇뭉뭍뭏뭐뭔뭘뭡뭣뭬뮈뮌뮐뮤뮨뮬뮴뮷므믄믈믐믓미믹민믿밀밂밈밉밋밌밍및밑바박밖밗반받발밝밞밟밤밥밧방밭배백밴밸뱀뱁뱃뱄뱅뱉뱌뱍뱐뱝버벅번벋벌벎범법벗벙벚베벡벤벧벨벰벱벳벴벵벼벽변별볍볏볐병볕볘볜보복볶본볼봄봅봇봉봐봔봤봬뵀뵈뵉뵌뵐뵘뵙뵤뵨부북분붇불붉붊붐붑붓붕붙붚붜붤붰붸뷔뷕뷘뷜뷩뷰뷴뷸븀븃븅브븍븐블븜븝븟비빅빈빌빎빔빕빗빙빚빛빠빡빤빨빪빰빱빳빴빵빻빼빽뺀뺄뺌뺍뺏뺐뺑뺘뺙뺨뻐뻑뻔뻗뻘뻠뻣뻤뻥뻬뼁뼈뼉뼘뼙뼛뼜뼝뽀뽁뽄뽈뽐뽑뽕뾔뾰뿅뿌뿍뿐뿔뿜뿟뿡쀼쁑쁘쁜쁠쁨쁩삐삑삔삘삠삡삣삥사삭삯산삳살삵삶삼삽삿샀상샅새색샌샐샘샙샛샜생샤샥샨샬샴샵샷샹섀섄섈섐섕서석섞섟선섣설섦섧섬섭섯섰성섶세섹센셀셈셉셋셌셍셔셕션셜셤셥셧셨셩셰셴셸솅소속솎손솔솖솜솝솟송솥솨솩솬솰솽쇄쇈쇌쇔쇗쇘쇠쇤쇨쇰쇱쇳쇼쇽숀숄숌숍숏숑수숙순숟술숨숩숫숭숯숱숲숴쉈쉐쉑쉔쉘쉠쉥쉬쉭쉰쉴쉼쉽쉿슁슈슉슐슘슛슝스슥슨슬슭슴습슷승시식신싣실싫심십싯싱싶싸싹싻싼쌀쌈쌉쌌쌍쌓쌔쌕쌘쌜쌤쌥쌨쌩썅써썩썬썰썲썸썹썼썽쎄쎈쎌쏀쏘쏙쏜쏟쏠쏢쏨쏩쏭쏴쏵쏸쐈쐐쐤쐬쐰쐴쐼쐽쑈쑤쑥쑨쑬쑴쑵쑹쒀쒔쒜쒸쒼쓩쓰쓱쓴쓸쓺쓿씀씁씌씐씔씜씨씩씬씰씸씹씻씽아악안앉않알앍앎앓암압앗았앙앝앞애액앤앨앰앱앳앴앵야약얀얄얇얌얍얏양얕얗얘얜얠얩어억언얹얻얼얽얾엄업없엇었엉엊엌엎에엑엔엘엠엡엣엥여역엮연열엶엷염엽엾엿였영옅옆옇예옌옐옘옙옛옜오옥온올옭옮옰옳옴옵옷옹옻와왁완왈왐왑왓왔왕왜왝왠왬왯왱외왹왼욀욈욉욋욍요욕욘욜욤욥욧용우욱운울욹욺움웁웃웅워웍원월웜웝웠웡웨웩웬웰웸웹웽위윅윈윌윔윕윗윙유육윤율윰윱윳융윷으윽은을읊음읍읏응읒읓읔읕읖읗의읜읠읨읫이익인일읽읾잃임입잇있잉잊잎자작잔잖잗잘잚잠잡잣잤장잦재잭잰잴잼잽잿쟀쟁쟈쟉쟌쟎쟐쟘쟝쟤쟨쟬저적전절젊점접젓정젖제젝젠젤젬젭젯젱져젼졀졈졉졌졍졔조족존졸졺좀좁좃종좆좇좋좌좍좔좝좟좡좨좼좽죄죈죌죔죕죗죙죠죡죤죵주죽준줄줅줆줌줍줏중줘줬줴쥐쥑쥔쥘쥠쥡쥣쥬쥰쥴쥼즈즉즌즐즘즙즛증지직진짇질짊짐집짓징짖짙짚짜짝짠짢짤짧짬짭짯짰짱째짹짼쨀쨈쨉쨋쨌쨍쨔쨘쨩쩌쩍쩐쩔쩜쩝쩟쩠쩡쩨쩽쪄쪘쪼쪽쫀쫄쫌쫍쫏쫑쫓쫘쫙쫠쫬쫴쬈쬐쬔쬘쬠쬡쭁쭈쭉쭌쭐쭘쭙쭝쭤쭸쭹쮜쮸쯔쯤쯧쯩찌찍찐찔찜찝찡찢찧차착찬찮찰참찹찻찼창찾채책챈챌챔챕챗챘챙챠챤챦챨챰챵처척천철첨첩첫첬청체첵첸첼쳄쳅쳇쳉쳐쳔쳤쳬쳰촁초촉촌촐촘촙촛총촤촨촬촹최쵠쵤쵬쵭쵯쵱쵸춈추축춘출춤춥춧충춰췄췌췐취췬췰췸췹췻췽츄츈츌츔츙츠측츤츨츰츱츳층치칙친칟칠칡침칩칫칭카칵칸칼캄캅캇캉캐캑캔캘캠캡캣캤캥캬캭컁커컥컨컫컬컴컵컷컸컹케켁켄켈켐켑켓켕켜켠켤켬켭켯켰켱켸코콕콘콜콤콥콧콩콰콱콴콸쾀쾅쾌쾡쾨쾰쿄쿠쿡쿤쿨쿰쿱쿳쿵쿼퀀퀄퀑퀘퀭퀴퀵퀸퀼큄큅큇큉큐큔큘큠크큭큰클큼큽킁키킥킨킬킴킵킷킹타탁탄탈탉탐탑탓탔탕태택탠탤탬탭탯탰탱탸턍터턱턴털턺텀텁텃텄텅테텍텐텔템텝텟텡텨텬텼톄톈토톡톤톨톰톱톳통톺톼퇀퇘퇴퇸툇툉툐투툭툰툴툼툽툿퉁퉈퉜퉤튀튁튄튈튐튑튕튜튠튤튬튱트특튼튿틀틂틈틉틋틔틘틜틤틥티틱틴틸팀팁팃팅파팍팎판팔팖팜팝팟팠팡팥패팩팬팰팸팹팻팼팽퍄퍅퍼퍽펀펄펌펍펏펐펑페펙펜펠펨펩펫펭펴편펼폄폅폈평폐폘폡폣포폭폰폴폼폽폿퐁퐈퐝푀푄표푠푤푭푯푸푹푼푿풀풂품풉풋풍풔풩퓌퓐퓔퓜퓟퓨퓬퓰퓸퓻퓽프픈플픔픕픗피픽핀필핌핍핏핑하학한할핥함합핫항핳해핵핸핼햄햅햇했행햐향허헉헌헐헒험헙헛헝헤헥헨헬헴헵헷헹혀혁현혈혐협혓혔형혜혠혤혭호혹혼홀홅홈홉홋홍홑화확환활홧황홰홱홴횃횅회획횐횔횝횟횡효횬횰횹횻후훅훈훌훑훔훗훙훠훤훨훰훵훼훽휀휄휑휘휙휜휠휨휩휫휭휴휵휸휼흄흇흉흐흑흔흖흗흘흙흠흡흣흥흩희흰흴흼흽힁히힉힌힐힘힙힛힝힣ㄱㄴㄷㄹㅁㅂㅅㅇㅈㅊㅋㅌㅍㅎㄲㄸㅃㅆㅉㄺㅀㄻㄼㅄㄳㄶㄵㄽㅏㅑㅓㅕㅗㅛㅜㅠㅡㅣㅒㅖ"
      );
    });
  });

  describe("space", () => {
    test("\n", () => {
      const str = "str\n123";
      const matched = str.match(spaceRegex)?.[0];
      expect(matched).toBe("\n");
    });

    test("\t", () => {
      const str = "str\t123";
      const matched = str.match(spaceRegex)?.[0];
      expect(matched).toBe("\t");
    });

    test("\r", () => {
      const str = "str\r123";
      const matched = str.match(spaceRegex)?.[0];
      expect(matched).toBe("\r");
    });

    test(" ", () => {
      const str = "str 123";
      const matched = str.match(spaceRegex)?.[0];
      expect(matched).toBe(" ");
    });

    test("\r\n\t \r\n", () => {
      const regex = new RegExp(`[${spaceRegex.source}]+`);
      const str = "\r\n\t \r\n";
      const matched = str.match(regex)?.[0];
      expect(matched).toBe("\r\n\t \r\n");
    });
  });

  describe("special character", () => {
    test(`special characters\`~!@#$%^&*-_=+;:,<.>/?|123`, () => {
      let str, matched, matchedStr;
      const regex = new RegExp(`[${specialCharRegex.source}]+`);

      str = `special characters\`~!@#$%^&*-_=+;:,<.>/?|123`;
      matched = str.match(regex);
      expect(matched).not.toBeNull();

      [matchedStr] = matched!;
      expect(matchedStr).toBe(`\`~!@#$%^&*-_=+;:,<.>/?|`);
    });
  });

  describe("character", () => {
    test("abcdefghijklmnopqrstuvwxyz", () => {
      const chars = "az";
      const regex = new RegExp(`[${charRegex}]+`);

      const matched = chars.match(regex);
      expect(matched?.[0]).toBe(chars);
    });

    test(`\`~!@#$%^&*-=_+\\|;:,.<>/?`, () => {
      const chars = `\`~!@#$%^&*-=_+\\|;:,.<>/?`;
      const regex = new RegExp(`[${charRegex}]+`);

      const matched = chars.match(regex);
      expect(matched?.[0]).toBe(chars);
    });

    test("0123456789", () => {
      const chars = "0123456789";
      const regex = new RegExp(`[${charRegex}]+`);

      const matched = chars.match(regex);
      expect(matched?.[0]).toBe(chars);
    });

    test("01abAZ!@#가힣ㄱㅎㅏㅣ", () => {
      const chars = "01abAZ!@#가힣ㄱㅎㅏㅣ";
      const regex = new RegExp(`[${charRegex}]+`);

      const matched = chars.match(regex);
      expect(matched?.[0]).toBe(chars);
    });
  });
});

describe("frontmatter", () => {
  test(`---
    title: title
    slug: s-l-u-g
    ---`, () => {
    const frontmatter = `---
        title: title
        slug: s-l-u-g
        ---`;
    const matched = frontmatter.match(frontmatterRegex);
    expect(matched).not.toBeNull();

    const [matchedStr] = matched!;
    const map = parseFrontmatterToMap(matchedStr);
    expect(map.get("title")).toBe("title");
    expect(map.get("slug")).toBe("s-l-u-g");
  });

  test(`---
    title: title!@#123제목 "[] {} ()" ''
    status: ready
    ---`, () => {
    const frontmatter = `---
    title: title!@#123제목 "[] {} ()" ''
    status: ready
    ---`;
    const matched = frontmatter.match(frontmatterRegex);
    expect(matched).not.toBeNull();

    const [matchedStr] = matched!;
    const map = parseFrontmatterToMap(matchedStr);
    expect(map.get("title")).toBe(`title!@#123제목 "[] {} ()" ''`);
    expect(map.get("status")).toBe("ready");
  });

  test(`---
    item1: !@#%
    item2: ---
    ---`, () => {
    const frontmatter = `---
    item1: !@#%
    item2: ---
    ---`;
    const matched = frontmatter.match(frontmatterRegex);
    expect(matched).not.toBeNull();

    const [matchedStr] = matched!;
    const map = parseFrontmatterToMap(matchedStr);
    expect(map.get("item1")).toBe(`!@#%`);
    expect(map.get("item2")).toBe("---");
  });

  test(`---
    한글_키: 한글_값
    ---`, () => {
    const frontmatter = `---
    한글_키: 한글_값
    ---`;
    const matched = frontmatter.match(frontmatterRegex);
    expect(matched).not.toBeNull();

    const [matchedStr] = matched!;
    const map = parseFrontmatterToMap(matchedStr);
    expect(map.get("한글_키")).toBe(`한글_값`);
  });
});

describe("comment", () => {
  test(`한국말을 포함한 코멘트`, () => {
    const comment = `<!-- 한국말 코멘트 -->`;
    const matched = comment.match(commentRegex)?.[0];
    expect(matched).toBe(comment);
  });

  test(`영어를 포함한 코멘트`, () => {
    const comment = `<!--- english comment --->`;
    const matched = comment.match(commentRegex)?.[0];
    expect(matched).toBe(comment);
  });

  test(`숫자를 포함한 코멘트`, () => {
    const comment = `<!--- 0123456789 --->`;
    const matched = comment.match(commentRegex)?.[0];
    expect(matched).toBe(comment);
  });

  test(`함수를 포함한 코멘트`, () => {
    const comment = `<!--
    function in comment
    \`\`\`ts
    function () {}
    console.log();
    \`\`\`
    -->`;
    const matched = comment.match(commentRegex)?.[0];
    expect(matched).toBe(comment);
  });

  test(`특수 문자를 포함한 코멘트`, () => {
    const comment = `<!-- 특수 문자 코멘트
    !@#$%^&*_+-=\\|;:,./<>?
    -->`;
    const matched = comment.match(commentRegex)?.[0];
    expect(matched).toBe(comment);
  });

  test("한국말/영어/숫자/함수/특수 문자가 포함된 코멘트", () => {
    const comment = `<!--
    abcABC1230
    \`\`\`ts
    function() {}
    \`\`\`
    특수 문자 코멘트
    !@#$%^&*()_+-=\\|;:,./<>?
    -->`;
    const matched = comment.match(commentRegex)?.[0];
    expect(matched).toBe(comment);
  });
});

describe("style", () => {
  describe("inline style property regex", () => {
    test("color: #fafcdd88;", () => {
      const styleProperty = "color: #fafcdd88;";
      const matched = styleProperty.match(inlineStylePropertyRegex);
      expect(matched).not.toBeNull();

      const [, key, value] = matched!;
      expect(key).toBe("color");
      expect(value).toBe("#fafcdd88");
    });

    test("-webkit-animation-delay: 2s", () => {
      const styleProperty = "-webkit-animation-delay: 2s";
      const matched = styleProperty.match(inlineStylePropertyRegex);
      expect(matched).not.toBeNull();

      const [, key, value] = matched!;
      expect(key).toBe("-webkit-animation-delay");
      expect(value).toBe("2s");
    });

    test("background: hsla(128, 30%, 72%, 0.12)", () => {
      const styleProperty = "background: hsla(128, 30%, 72%, 0.12)";
      const matched = styleProperty.match(inlineStylePropertyRegex);
      expect(matched).not.toBeNull();

      const [, key, value] = matched!;
      expect(key).toBe("background");
      expect(value).toBe("hsla(128, 30%, 72%, 0.12)");
    });

    test("background: linear-gradient(45deg, red 50%, blue 100%)", () => {
      const styleProperty =
        "background: linear-gradient(45deg, red 50%, blue 100%)";
      const matched = styleProperty.match(inlineStylePropertyRegex);
      expect(matched).not.toBeNull();

      const [, key, value] = matched!;
      expect(key).toBe("background");
      expect(value).toBe("linear-gradient(45deg, red 50%, blue 100%)");
    });
  });

  describe("inline style regex", () => {
    test(`<div style="color: #fafbfc88; width: 30px;">`, () => {
      const div = `<div style="color: #fafbfc88; width: 30px;">`;
      const matched = div.match(inlineStyleRegex);
      expect(matched).not.toBeNull();

      const [style, properties] = matched!;
      expect(style).toBe(`style="color: #fafbfc88; width: 30px;"`);
      expect(properties).toBe(`color: #fafbfc88; width: 30px;`);
    });

    test(`<div style="background: linear-gradient(45deg, #fff, #fafee1); -webkit-animation-delay: 2s">`, () => {
      const div = `<div style="background: linear-gradient(45deg, #fff, #fafee1); -webkit-animation-delay: 2s">`;
      const matched = div.match(inlineStyleRegex);
      expect(matched).not.toBeNull();

      const [style, properties] = matched!;
      expect(style).toBe(
        `style="background: linear-gradient(45deg, #fff, #fafee1); -webkit-animation-delay: 2s"`
      );
      expect(properties).toBe(
        `background: linear-gradient(45deg, #fff, #fafee1); -webkit-animation-delay: 2s`
      );
    });
  });

  describe("JSX style property regex", () => {
    test(`width: 30`, () => {
      const styleProperty = `width: 30"`;
      const matched = styleProperty.match(JSXStylePropertyRegex);
      expect(matched).not.toBeNull();

      const [, key, value] = matched!;
      expect(key).toBe("width");
      expect(value).toBe("30");
    });

    test(`height: 30px`, () => {
      const styleProperty = `height: 30px"`;
      const matched = styleProperty.match(JSXStylePropertyRegex);
      expect(matched).not.toBeNull();

      const [, key, value] = matched!;
      expect(key).toBe("height");
      expect(value).toBe("30px");
    });

    test(`color: "#fafcdd88"`, () => {
      const styleProperty = `color: "#fafcdd88"`;
      const matched = styleProperty.match(JSXStylePropertyRegex);
      expect(matched).not.toBeNull();

      const [, key, value] = matched!;
      expect(key).toBe("color");
      expect(value).toBe("#fafcdd88");
    });

    test(`WebkitAlignItems: "flex-start"`, () => {
      const styleProperty = `WebkitAlignItems: "flex-start"`;
      const matched = styleProperty.match(JSXStylePropertyRegex);
      expect(matched).not.toBeNull();

      const [, key, value] = matched!;
      expect(key).toBe("WebkitAlignItems");
      expect(value).toBe("flex-start");
    });

    test(`MozAnimationDelay: "-moz-initial"`, () => {
      const styleProperty = `MozAnimationDelay: "-moz-initial"`;
      const matched = styleProperty.match(JSXStylePropertyRegex);
      expect(matched).not.toBeNull();

      const [, key, value] = matched!;
      expect(key).toBe("MozAnimationDelay");
      expect(value).toBe("-moz-initial");
    });

    test(`background: "hsla(128, 30%, 72%, 0.12)"`, () => {
      const styleProperty = `background: "hsla(128, 30%, 72%, 0.12)"`;
      const matched = styleProperty.match(JSXStylePropertyRegex);
      expect(matched).not.toBeNull();

      const [, key, value] = matched!;
      expect(key).toBe("background");
      expect(value).toBe("hsla(128, 30%, 72%, 0.12)");
    });

    test(`background: "linear-gradient(45deg, red 50%, blue 100%)"`, () => {
      const styleProperty = `background: "linear-gradient(45deg, red 50%, blue 100%)"`;
      const matched = styleProperty.match(JSXStylePropertyRegex);
      expect(matched).not.toBeNull();

      const [, key, value] = matched!;
      expect(key).toBe("background");
      expect(value).toBe("linear-gradient(45deg, red 50%, blue 100%)");
    });
  });

  describe("JSX style regex", () => {
    test(`<div style={{ width: 30, height: "30px", color: "#fafed1", WebkitAlignItems: "flex-start", MozAnimationDelay: "-moz-initial", background: "hsla(128, 30%, 72%, 0.12)", }} />`, () => {
      const div = `<div
        style={{
          width: 30,
          height: "30px",
          color: "#fafed1",
          WebkitAlignItems: "flex-start",
          MozAnimationDelay: "-moz-initial",
          background: "hsla(128, 30%, 72%, 0.12)",
        }}
      />;`;

      const matched = div.match(JSXStyleRegex);
      expect(matched).not.toBeNull();

      const [style, properties] = matched!;
      expect(style).toBe(`style={{
          width: 30,
          height: "30px",
          color: "#fafed1",
          WebkitAlignItems: "flex-start",
          MozAnimationDelay: "-moz-initial",
          background: "hsla(128, 30%, 72%, 0.12)",
        }}`);

      const parseMap = parseJSXStyleStringToMap(properties);
      expect(parseMap.get("width")).toBe("30");
      expect(parseMap.get("height")).toBe("30px");
      expect(parseMap.get("color")).toBe("#fafed1");
      expect(parseMap.get("WebkitAlignItems")).toBe("flex-start");
      expect(parseMap.get("MozAnimationDelay")).toBe("-moz-initial");
      expect(parseMap.get("background")).toBe("hsla(128, 30%, 72%, 0.12)");
    });
  });
});

describe("reference", () => {
  test(`
  ## 참조
  - https://!@#$%^&*_=-+;,./?><\\|1234
  - [링크](https://...)
  - ----
  `, () => {
    const markdown = `
    ## 참조
    - https://!@#$%^&*_=-+;,./?><\\|1234
    - [링크](https://...)
    - ----
    `;
    const matched = markdown.match(referenceRegex)?.[0];
    expect(matched).toBe(markdown.trimStart());
  });

  test(`
  ## 참조
  - https://262.ecma-international.org/14.0/?_gl=1*1szfzq*_ga*MjEyNDk2MTYwNy4xNzA2MzE5ODM2*_ga_TDCK4DWEPP*MTcwNjkzMzgyNC4xMC4xLjE3MDY5MzM5MjcuMC4wLjA.&_ga=2.190502702.48397567.1706933825-2124961607.1706319836#sec-object.prototype.__proto__
  `, () => {
    const markdown = `
    ## 참조
    - https://262.ecma-international.org/14.0/?_gl=1*1szfzq*_ga*MjEyNDk2MTYwNy4xNzA2MzE5ODM2*_ga_TDCK4DWEPP*MTcwNjkzMzgyNC4xMC4xLjE3MDY5MzM5MjcuMC4wLjA.&_ga=2.190502702.48397567.1706933825-2124961607.1706319836#sec-object.prototype.__proto__
    `;
    const matched = markdown.match(referenceRegex)?.[0];
    expect(matched).toBe(markdown.trimStart());
  });
  test(`
  ## 참조
  - https://262.ecma-international.org/14.0/?_gl=1*1szfzq*_ga*MjEyNDk2MTYwNy4xNzA2MzE5ODM2*_ga_TDCK4DWEPP*MTcwNjkzMzgyNC4xMC4xLjE3MDY5MzM5MjcuMC4wLjA.&_ga=2.190502702.48397567.1706933825-2124961607.1706319836#sec-object.prototype.__proto__
  `, () => {
    const markdown = `
    ## 참조
    - https://262.ecma-international.org/14.0/?_gl=1*1szfzq*_ga*MjEyNDk2MTYwNy4xNzA2MzE5ODM2*_ga_TDCK4DWEPP*MTcwNjkzMzgyNC4xMC4xLjE3MDY5MzM5MjcuMC4wLjA.&_ga=2.190502702.48397567.1706933825-2124961607.1706319836#sec-object.prototype.__proto__
    `;
    const matched = markdown.match(referenceRegex)?.[0];
    expect(matched).toBe(markdown.trimStart());
  });
  test(`
  body

  ## 참조
  - https://...

  <!--
  comment
  -->`, () => {
    const markdown = `
    body

    ## 참조
    - https://...

    <!--
    comment
    -->`;
    const matched = markdown.match(referenceRegex)?.[0];
    expect(matched).toBe(
      `## 참조
    - https://...\n`
    );
  });
  test(`
  ## 정리
  렉시컬 스코프는 [호이스팅](./execution-context.md#호이스팅), [클로저](./closure.md), [실행 컨텍스트](./execution-context.md) 등
  
  ## 참조
  - https://www.etymonline.com/kr/word/lexical
  - https://poiemaweb.com/js-scope
  `, () => {
    const markdown = `
    ## 정리
    렉시컬 스코프는 [호이스팅](./execution-context.md#호이스팅), [클로저](./closure.md), [실행 컨텍스트](./execution-context.md) 등
    
    ## 참조
    - https://www.etymonline.com/kr/word/lexical
    - https://poiemaweb.com/js-scope
    `;
    const matched = markdown.match(referenceRegex)?.[0];
    expect(matched).toBe(`## 참조
    - https://www.etymonline.com/kr/word/lexical
    - https://poiemaweb.com/js-scope
    `);
  });
});

describe("link", () => {
  test("[Smoke Particle System](http://blhog.vercel.app/graphic/smoke-particle-system)", () => {
    const link =
      "[Smoke Particle System](http://blhog.vercel.app/graphic/smoke-particle-system)";
    const matched = link.match(linkRegex);
    expect(matched).not.toBeNull();
    console.log(matched);

    const [, title, url] = matched!;
    expect(title).toBe("Smoke Particle System");
    expect(url).toBe("http://blhog.vercel.app/graphic/smoke-particle-system");
  });

  test("[var, let, const 비교](https://ui.dev/var-let-const)", () => {
    const link = "[var, let, const 비교](https://ui.dev/var-let-const)";
    const matched = link.match(linkRegex);
    expect(matched).not.toBeNull();

    const [, title, url] = matched!;
    expect(title).toBe("var, let, const 비교");
    expect(url).toBe("https://ui.dev/var-let-const");
  });

  test("[클로저](./closure.md)", () => {
    const link = "[클로저](./closure.md)";
    const matched = link.match(linkRegex);
    expect(matched).not.toBeNull();

    const [, title, url] = matched!;
    expect(title).toBe("클로저");
    expect(url).toBe("./closure.md");
  });

  test("[괄호(소괄호){중괄호}[대괄호]](./bracket.md)", () => {
    const link = "[괄호(소괄호){중괄호}[대괄호]](./bracket.md)";
    const matched = link.match(linkRegex);
    expect(matched).not.toBeNull();

    const [, title, url] = matched!;
    expect(title).toBe("괄호(소괄호){중괄호}[대괄호]");
    expect(url).toBe("./bracket.md");
  });

  test("[JavaScript Visualizer](https://ui.dev/ultimate-guide-to-execution-contexts-hoisting-scopes-and-closures-in-javascript#:~:text=Visualizer%EB%A5%BC%20%EC%82%B4%ED%8E%B4%EB%B3%B4%EA%B2%A0%EC%8A%B5%EB%8B%88%EB%8B%A4.-,%EC%BD%94%EB%93%9C%EB%A5%BC%20%EC%A7%81%EC%A0%91%20%EC%8B%9C%EA%B0%81%ED%99%94%ED%95%B4%20%EB%B3%B4%EC%84%B8%EC%9A%94,-%EC%9A%B0%EB%A6%AC%EB%8A%94%20undefined%2C)", () => {
    const link =
      "[JavaScript Visualizer](https://ui.dev/ultimate-guide-to-execution-contexts-hoisting-scopes-and-closures-in-javascript#:~:text=Visualizer%EB%A5%BC%20%EC%82%B4%ED%8E%B4%EB%B3%B4%EA%B2%A0%EC%8A%B5%EB%8B%88%EB%8B%A4.-,%EC%BD%94%EB%93%9C%EB%A5%BC%20%EC%A7%81%EC%A0%91%20%EC%8B%9C%EA%B0%81%ED%99%94%ED%95%B4%20%EB%B3%B4%EC%84%B8%EC%9A%94,-%EC%9A%B0%EB%A6%AC%EB%8A%94%20undefined%2C)";
    const matched = link.match(linkRegex);
    expect(matched).not.toBeNull();

    const [, title, url] = matched!;
    expect(title).toBe("JavaScript Visualizer");
    expect(url).toBe(
      "https://ui.dev/ultimate-guide-to-execution-contexts-hoisting-scopes-and-closures-in-javascript#:~:text=Visualizer%EB%A5%BC%20%EC%82%B4%ED%8E%B4%EB%B3%B4%EA%B2%A0%EC%8A%B5%EB%8B%88%EB%8B%A4.-,%EC%BD%94%EB%93%9C%EB%A5%BC%20%EC%A7%81%EC%A0%91%20%EC%8B%9C%EA%B0%81%ED%99%94%ED%95%B4%20%EB%B3%B4%EC%84%B8%EC%9A%94,-%EC%9A%B0%EB%A6%AC%EB%8A%94%20undefined%2C"
    );
  });

  test("[글](../performance/RAIL-model.md)", () => {
    const link = "[글](../performance/RAIL-model.md)";
    const matched = link.match(linkRegex);
    expect(matched).not.toBeNull();

    const [, title, src] = matched!;
    expect(title).toBe("글");
    expect(src).toBe("../performance/RAIL-model.md");
  });

  test("[글](../performance/RAIL-model.md#response)", () => {
    const link = "[글](../performance/RAIL-model.md#response)";
    const matched = link.match(linkRegex);
    expect(matched).not.toBeNull();

    const [, title, src] = matched!;
    expect(title).toBe("글");
    expect(src).toBe("../performance/RAIL-model.md#response");
  });

  test("[글](https://blhog.vercel.app/posts/performance/RAIL-model.md#response)", () => {
    const link =
      "[글](https://blhog.vercel.app/posts/performance/RAIL-model.md#response)";
    const matched = link.match(linkRegex);
    expect(matched).not.toBeNull();

    const [, title, src] = matched!;
    expect(title).toBe("글");
    expect(src).toBe(
      "https://blhog.vercel.app/posts/performance/RAIL-model.md#response"
    );
  });

  test("[Kinetic Typography](https://www.google.com/search?q=kinetic+typography+cmiscm&oq=kinetic+typography+cmiscm&gs_lcrp=EgZjaHJvbWUyBggAEEUYOdIBCDQ2MDZqMGoxqAIAsAIA&sourceid=chrome&ie=UTF-8#fpstate=ive&vld=cid:5a335bca,vid:Df4RviUikZ0,st:0)", () => {
    const link =
      "[Kinetic Typography](https://www.google.com/search?q=kinetic+typography+cmiscm&oq=kinetic+typography+cmiscm&gs_lcrp=EgZjaHJvbWUyBggAEEUYOdIBCDQ2MDZqMGoxqAIAsAIA&sourceid=chrome&ie=UTF-8#fpstate=ive&vld=cid:5a335bca,vid:Df4RviUikZ0,st:0)";
    const matched = link.match(linkRegex);
    expect(matched).not.toBeNull();

    const [, title, src] = matched!;
    expect(title).toBe("Kinetic Typography");
    expect(src).toBe(
      "https://www.google.com/search?q=kinetic+typography+cmiscm&oq=kinetic+typography+cmiscm&gs_lcrp=EgZjaHJvbWUyBggAEEUYOdIBCDQ2MDZqMGoxqAIAsAIA&sourceid=chrome&ie=UTF-8#fpstate=ive&vld=cid:5a335bca,vid:Df4RviUikZ0,st:0"
    );
  });
});

describe("md", () => {
  test("[클로저](./closure.md)", () => {
    const link = "[클로저](./closure.md)";
    const matched = link.match(mdRegex);
    expect(matched).not.toBeNull();

    const actual = matched![0];
    expect(actual).toBe(".md");
  });

  test("[글](../performance/RAIL-model.md#response)", () => {
    const link = "[글](../performance/RAIL-model.md#response)";
    const matched = link.match(mdRegex);
    expect(matched).not.toBeNull();

    const [, hash] = matched!;
    expect(hash).toBe("#response");
  });

  test("[글](../performance/RAIL-model.md#response)", () => {
    const link = "[글](../performance/RAIL-model.md#response)";
    const matched = link.match(mdRegex);
    expect(matched).not.toBeNull();

    const [, hash] = matched!;
    expect(hash).toBe("#response");
  });
});

describe("img", () => {
  describe("property", () => {
    describe("title", () => {
      test(`<img title="ab123!@#%[](){}" />`, () => {
        const img = `<img title="ab123!@#%[](){}" />`;
        const matched = img.match(titleRegex);
        expect(matched).not.toBeNull();

        const [matchedStr, title] = matched!;
        expect(matchedStr).toBe(`title="ab123!@#%[](){}"`);
        expect(title).toBe("ab123!@#%[](){}");
      });

      test(`<img src="..." style="..." title="ab123!@#%[](){}" id="id" />`, () => {
        const img = `<img src="..." style="..." title="ab123!@#%[](){}" id="id" />`;
        const matched = img.match(titleRegex);
        expect(matched).not.toBeNull();

        const [matchedStr, title] = matched!;
        expect(matchedStr).toBe(`title="ab123!@#%[](){}"`);
        expect(title).toBe("ab123!@#%[](){}");
      });

      test(`<img title="i-m-a-g-e" />`, () => {
        const img = `<img title="i-m-a-g-e" />`;
        const matched = img.match(titleRegex);
        expect(matched).not.toBeNull();

        const [matchedStr, title] = matched!;
        expect(matchedStr).toBe(`title="i-m-a-g-e"`);
        expect(title).toBe("i-m-a-g-e");
      });
    });

    describe("alt", () => {
      test(`<img title="ab123!@#%[](){}" alt="im a ge deScripti@n" />`, () => {
        const img = `<img title="ab123!@#%[](){}" alt="im a ge deScripti@n" />`;
        const matched = img.match(altRegex);
        expect(matched).not.toBeNull();

        const [matchedStr, title] = matched!;
        expect(matchedStr).toBe(`alt="im a ge deScripti@n"`);
        expect(title).toBe("im a ge deScripti@n");
      });

      test(`<img src="..." style="..." alt="!@#$qwer123이미지 설명" title="ab123!@#%[](){}" id="id" />`, () => {
        const img = `<img src="..." style="..." alt="!@#$qwer123이미지 설명" title="ab123!@#%[](){}" id="id" />`;
        const matched = img.match(altRegex);
        expect(matched).not.toBeNull();

        const [matchedStr, title] = matched!;
        expect(matchedStr).toBe(`alt="!@#$qwer123이미지 설명"`);
        expect(title).toBe("!@#$qwer123이미지 설명");
      });
    });

    describe("style", () => {
      test(`<img src="..." style="width: 30px; height: 100px;" title="...`, () => {
        const img = `<img src="..." style="width: 30px; height: 100px;" title="...`;
        const matched = img.match(inlineStyleRegex);
        expect(matched).not.toBeNull();

        const [matchedStr, title] = matched!;
        expect(matchedStr).toBe(`style="width: 30px; height: 100px;"`);
        expect(title).toBe("width: 30px; height: 100px;");
      });
    });

    describe("src", () => {
      describe("ext", () => {
        test(`<img src="../../assets/img.png"`, () => {
          const img = `<img src="../../assets/img.png" />`;
          const matched = img.match(srcRegex);
          expect(matched).not.toBeNull();

          const [, src, ext] = matched!;
          expect(src).toBe("../../assets/img");
          expect(ext).toBe("png");
        });

        test(`<img src="../../assets/img.jpeg"`, () => {
          const img = `<img src="../../assets/img.jpeg" />`;
          const matched = img.match(srcRegex);
          expect(matched).not.toBeNull();

          const [, src, ext] = matched!;
          expect(src).toBe("../../assets/img");
          expect(ext).toBe("jpeg");
        });

        test(`<img src="../../assets/img.jpg"`, () => {
          const img = `<img src="../../assets/img.jpg" />`;
          const matched = img.match(srcRegex);
          expect(matched).not.toBeNull();

          const [, src, ext] = matched!;
          expect(src).toBe("../../assets/img");
          expect(ext).toBe("jpg");
        });

        test(`<img src="../../assets/img.svg"`, () => {
          const img = `<img src="../../assets/img.svg" />`;
          const matched = img.match(srcRegex);
          expect(matched).not.toBeNull();

          const [, src, ext] = matched!;
          expect(src).toBe("../../assets/img");
          expect(ext).toBe("svg");
        });

        test(`<img src="../../assets/img.avif"`, () => {
          const img = `<img src="../../assets/img.avif" />`;
          const matched = img.match(srcRegex);
          expect(matched).not.toBeNull();

          const [, src, ext] = matched!;
          expect(src).toBe("../../assets/img");
          expect(ext).toBe("avif");
        });

        test(`<img src="../../assets/img.webp"`, () => {
          const img = `<img src="../../assets/img.webp" />`;
          const matched = img.match(srcRegex);
          expect(matched).not.toBeNull();

          const [, src, ext] = matched!;
          expect(src).toBe("../../assets/img");
          expect(ext).toBe("webp");
        });

        test(`<img src="../../assets/img.webp"`, () => {
          const img = `<img src="../../assets/img.webp" />`;
          const matched = img.match(srcRegex);
          expect(matched).not.toBeNull();

          const [, src, ext] = matched!;
          expect(src).toBe("../../assets/img");
          expect(ext).toBe("webp");
        });
      });

      describe("다른 프로퍼티와 동작 여부", () => {
        test(`<img title="..." style='...' src="https://a.com/b.png" id="IMG" />`, () => {
          const img = `<img title="..." style='...' src="https://a.com/b.png" id="IMG" />`;
          const matched = img.match(srcRegex);
          expect(matched).not.toBeNull();

          const [, src, ext] = matched!;
          expect(src).toBe("https://a.com/b");
          expect(ext).toBe("png");
        });
      });

      describe("https", () => {
        test(`<img src="https://a.io/static/7a99/15f/e.jpg" />`, () => {
          const img = `<img src="https://a.io/static/7a99/15f/e.jpg" />`;
          const matched = img.match(srcRegex);
          expect(matched).not.toBeNull();

          const [, src, ext] = matched!;
          expect(src).toBe("https://a.io/static/7a99/15f/e");
          expect(ext).toBe("jpg");
        });
      });

      describe("base64", () => {
        test(`<img src="data:image/jpeg;base64,/9j/4AAQSkZ=" />`, () => {
          const img = `<img src="data:image/jpeg;base64,/9j/4AAQSkZ=" />`;
          const matched = img.match(base64SrcRegex);
          expect(matched).not.toBeNull();

          const [, ext, src] = matched!;
          expect(ext).toBe("jpeg");
          expect(src).toBe("/9j/4AAQSkZ=");
        });
      });

      describe("local path", () => {
        test(`relative path`, () => {
          let img, matched, src, ext;

          img = `<img src="../assets/a.png" />`;
          matched = img.match(srcRegex);
          expect(matched).not.toBeNull();

          [, src, ext] = matched!;
          expect(src).toBe("../assets/a");
          expect(ext).toBe("png");

          img = `<img src="./assets/a.webp" />`;
          matched = img.match(srcRegex);
          expect(matched).not.toBeNull();

          [, src, ext] = matched!;
          expect(src).toBe("./assets/a");
          expect(ext).toBe("webp");
        });

        test(`absolute path`, () => {
          let img, matched, src, ext;

          img = `<img src="@/assets/a.png" />`;
          matched = img.match(srcRegex);
          expect(matched).not.toBeNull();

          [, src, ext] = matched!;
          expect(src).toBe("@/assets/a");
          expect(ext).toBe("png");

          img = `<img src="assets/a.webp" />`;
          matched = img.match(srcRegex);
          expect(matched).not.toBeNull();

          [, src, ext] = matched!;
          expect(src).toBe("assets/a");
          expect(ext).toBe("webp");
        });
      });
    });
  });

  describe("element", () => {
    test(`<img title="i-m-a-g-e" src="../../assets/img.webp" style="width: 30px; height: 100px;" alt="im a ge deScripti@n" />`, () => {
      const img = `<img title="i-m-a-g-e" src="../../assets/img.webp" style="width: 30px; height: 100px;" alt="im a ge deScripti@n" />`;
      const matched = img.match(imgRegex);
      expect(matched).not.toBeNull();

      const [matchedStr, props] = matched!;
      expect(matchedStr).toBe(
        `<img title="i-m-a-g-e" src="../../assets/img.webp" style="width: 30px; height: 100px;" alt="im a ge deScripti@n" />`
      );
      expect(props).toBe(
        `title="i-m-a-g-e" src="../../assets/img.webp" style="width: 30px; height: 100px;" alt="im a ge deScripti@n"`
      );
    });

    test(`<img title="!@#A3$%^" style="display: flex;" src="../../assets/img.webp"`, () => {
      const img = `<img title="!@#A3$%^" style="display: flex;" src="../../assets/img.webp">`;
      const matched = img.match(imgRegex);
      expect(matched).not.toBeNull();

      const [matchedStr, props] = matched!;
      expect(matchedStr).toBe(
        `<img title="!@#A3$%^" style="display: flex;" src="../../assets/img.webp">`
      );
      expect(props).toBe(
        `title="!@#A3$%^" style="display: flex;" src="../../assets/img.webp"`
      );
    });

    test(`<div>
        <img title="i-m-a-g-e!@#A3" style="display: flex;" src="../../assets/img.webp" />
      </div>`, () => {
      const img = `<div>
        <img title="i-m-a-g-e!@#A3" style="display: flex;" src="../../assets/img.webp" />
      </div>`;
      const matched = img.match(imgRegex);
      expect(matched).not.toBeNull();

      const [matchedStr, props] = matched!;
      expect(matchedStr).toBe(
        `<img title="i-m-a-g-e!@#A3" style="display: flex;" src="../../assets/img.webp" />`
      );
      expect(props).toBe(
        `title="i-m-a-g-e!@#A3" style="display: flex;" src="../../assets/img.webp"`
      );
    });

    test(`<div>
        <img alt="!@#$ASDasd" src="../../assets/img.webp" title="i-m-a-g-e!@#A3" style="display: flex;" />
      </div>`, () => {
      const img = `<div>
        <img alt="!@#$ASDasd" src="../../assets/img.webp" title="i-m-a-g-e!@#A3" style="display: flex;" />
      </div>`;

      const matched = img.match(imgRegex);
      expect(matched).not.toBeNull();

      const [matchedStr, props] = matched!;
      expect(matchedStr).toBe(
        `<img alt="!@#$ASDasd" src="../../assets/img.webp" title="i-m-a-g-e!@#A3" style="display: flex;" />`
      );
      expect(props).toBe(
        `alt="!@#$ASDasd" src="../../assets/img.webp" title="i-m-a-g-e!@#A3" style="display: flex;"`
      );
    });
  });
});

describe("heading", () => {
  describe("row", () => {
    test(`# heading 123 !@# 가힣 [] {} () '"`, () => {
      const row = `# heading 123 !@# 가힣 [] {} () '"`;
      const matched = row.match(headingRegex);
      expect(matched).not.toBeNull();

      const [matchedStr, sharps, heading] = matched!;
      expect(matchedStr).toBe(`# heading 123 !@# 가힣 [] {} () '"`);
      expect(sharps).toBe(`#`);
      expect(heading).toBe(`heading 123 !@# 가힣 [] {} () '"`);
    });

    test(`#### ### ## #`, () => {
      const row = `#### ### ## #`;
      const matched = row.match(headingRegex);
      expect(matched).not.toBeNull();

      const [matchedStr, sharps, heading] = matched!;
      expect(matchedStr).toBe(`#### ### ## #`);
      expect(sharps).toBe(`####`);
      expect(heading).toBe(`### ## #`);
    });
  });
});
