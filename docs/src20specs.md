# SRC-20 Tokens

[Original Documentation Source](https://github.com/hydren-crypto/stampchain/blob/main/docs/src20.md)

SRC-20 Specifications have changed protocol specifications as of block 796,000.
SRC-20 transactions are now created directly on BTC and are no-longer supported
as Counterparty transactions. SRC-20 mints, deploys, and transfers are all free
from an service fees with the exception of the BTC miners fee when done from a
supported wallet. See:
[https://stampchain.io/docs#/default/post_api_v2_src20_create](https://stampchain.io/docs#/default/post_api_v2_src20_create)
and [/core/utils/minting/src20/index.ts](/core/utils/minting/src20/index.ts)

SRC-20 is a bleeding edge specification modeled after BRC-20. Prior
specifications of SRC-20 in its initial state were built on top of Counterparty
transactions with specific requirements for an issuance transaction. The current
specification as of block 796,000 encodes the SRC-20 transaction directly onto
BTC and does not use Counterparty. Any SRC-20 transactions created on
Counterparty after block 796,000 will be invalid. Counterparty was used as a
proof of concept as we designed a direct to BTC method which optimizes the
transaction size and reduces cost of SRC-20 transactions.

# Supported Wallets

The SRC-20 Stamp Wallet is available here:

[The Stamp Wallet](https://www.thestampwallet.com/) this allows
deploy/mint/transfer of SRC-20 tokens and viewing STAMPS and SRC-20 tokens with
the wallet, but currently does not have a wallet connect feature to interact
with web apps for trading for example.

[Leather Wallet](https://leather.io/) also supports viewing STAMP and SRC-20
tokens within the wallet. This wallet can be connected to web apps for trading
of SRC-20 tokens and other functionality provided by the web app.

# Specifications

SRC-20 Tokens must conform to these **required** fields or a Bitcoin Stamp
Number will not be created, the transaction will not be considered a valid
SRC-20 transaction, and they will not appear in the Bitcoin Stamps Protocol
index / API.

SRC-20 transaction must be signed and broadcast onto BTC by the address that
holds the SRC-20 token balance as it acts as a means to authenticate ownership.
Both the source and destination addresses are embedded into the BTC transaction
which is created by the users wallet. Please use extreme caution if signing
transactions created by a third party. These transactions can include additional
outputs that may send your BTC to an address you do not control.

### DEPLOY

```JSON
{
  "p": "src-20",
  "op": "deploy",
  "tick": "STAMP",
  "max": "100000",
  "lim": "100",
  "dec": "18" // [optional]
}
```

### MINT

```JSON
{
  "p": "src-20",
  "op": "mint",
  "tick": "STAMP",
  "amt": "100"
}
```

### TRANSFER

```JSON
{
  "p": "src-20",
  "op": "transfer",
  "tick": "STAMP",
  "amt": "100"
}
```

If the amount specified to be transferred exceeds the balance held (which would
be determined by the latest state of an Indexer), then the transfer will be
deemed invalid.

# SRC-20 Token Requirements

1. Tokens must be 1-5 characters in length.
2. Allowed characters: a. Any word character (alphanumeric characters and
   underscores) b. Special characters: ~!@#$%^&*()_+=<>? c. Most printable
   emojis in U+1F300 to U+1F5FF
3. Disallowed characters:\
   a. Non-printable Unicode characters\
   b. Quotation marks: " ` ' outside of regular json delimiters\
   c. Any character not present in **Allowed Chars for Tick Field**
4. Only numeric values are allowed in the "max", "amt", "lim" fields
5. Other Qualifications:
   - The third multisig pubkeys must be to a valid Keyburn address
   - not case sensitive DOGE=doge
   - max mint/transfer/lim amount: uint64_max 18,446,744,073,709,551,615
     (**commas not allowed**, here for readability only)
   - max decimals: 18 (default - no need to specify unless a lower precision is
     desired)
   - json strings are not order sensitive
   - json strings are not case sensitive
   - MAX, LIM fields are integers only
   - AMT field is a decimal up to uint64 max with 18 decimals
   - Must be a valid CP transaction for transactions prior to block 796,000 have
     0 assets issued, locked, and not divisible
   - Must be a valid BASE64 as decoded by Python 3.9
     base64.b64decode(base64_string prior to block 796,000
6. Balance Calculations
   - Mints over the limit are capped - user will receive the limit amount if the
     token has not exceeded the max value
   - Deploys to the same tick which are previously deployed are invalid
   - Negative mints and transfers are invalid
   - If a mint is within the limit, but not within the max it is capped at the
     max value
   - Any mint where max has already been exceeded is invalid (overmint)
   - Any transfer over the users balance at the time of transfer is considered
     invalid and will not impact either users balance
     - if wallet _x_ has 1 KEVIN token and attempts to transfer 10000 KEVIN
       tokens to address _y_ the entire transaction is invalid

# SRC-20 Token Example JSON Strings

```
🔺🔺 Invalid Examples: 🚫🚫

{"p": "src-20", "op": "mint", "tick": "🙂APL", "amt": "18446744073709551616"} ## over uint64_max
{"p": "src-20", "op": "mint", "tick": "🙂@PL", "amt": "18,446"}     ## commas not allowed in amt
{"p": "src-20", "op": "mint", "tick": "🙂"PL", "amt": "100"}        ## double quotes not allowed in tick
{'p': 'src-20', 'op': 'mint', 'tick': ' rare', 'amt': '1000'}       ## invalid space in tick
{'p': 'src-20', 'op': 'deploy', 'tick': 'rare', 'max': '100.000'}       ## invalid period in max, and missing lim
```

```
👍👌 Valid Examples: 👌👍

{"p": "src-20", "tick": "🙂APL", "op": "mint", "amt": "100"}
{"p": "src-20", "op": "mint", "tick": "STAMP", "amt": "18446744073709551615"}
{"p": "src-20", "op": "mint", "tick": "🙂P`L", "amt": "100"}
{"p": "src-20", "op": "mint", "tick": "🙂PL?", "amt": "100"}
{"p": "src-20", "op": "mint", "tick": "🙂PL?", "amt": "100"}
{"p": "src-20", "op": "mint", "tick": "🙂PL", "amt": "100"}
{"p": "src-20", "op": "mint", "tick": "🙂PL", "amt": 100}
{"p": "src-20", "op": "mint", "tick": "PIZZA", "amt": "11111", "random": "test"}  
{
 "p": "src-20",
 "op": "deploy",
 "tick": "KEVN",
 "max": "2844674409551615",
 "lim": "1000"
}
```

**INVALID** tokens will not be created in the Bitcoin Stamps Protocol index or
API, and the transaction will not be considered a valid SRC-20 transaction. Any
further modifications to the standard must be designed around backwards
compatibility.

## Allowed Chars for Tick Field

1. **Standard Characters**:
   - Punctuation: `.!#$%&*()`
   - Numbers: `0123456789`
   - Special: `<=>?@^_~`
   - Uppercase: `ABCDEFGHIJKLMNOPQRSTUVWXYZ`
   - Lowercase: `abcdefghijklmnopqrstuvwxyz`

2. **Unicode Characters**: {'🚔', '🪕', '🈯', '👶', '🧜', '🔺', '👚', '🥠',
   '🪛', '👮', '🎗', '🙂', '🅱', '🍝', '🎣', '🎸', '👈', '🔈', '🗯', '🗻', '🛡',
   '🦋', '🐛', '📇', '🧴', '📻', '👂', '💎', '😼', '🥐', '😙', '🏏', '💵', '😧',
   '🌞', '🦹', '🦣', '😤', '🕚', '🦨', '👱', '🛬', '🥍', '😠', '🚼', '🚉', '🍟',
   '📑', '🛺', '🌗', '🐏', '🔑', '🌪', '💠', '👛', '📺', '🥵', '🐇', '🩴', '🍊',
   '🥋', '🚫', '🦼', '🔋', '🚶', '🔭', '🍇', '🍳', '🏸', '🙍', '🚰', '🌻', '🖕',
   '🌖', '📓', '🍿', '🧤', '🦳', '🧽', '🔌', '🦶', '🗺', '🚌', '🤔', '🏆', '💜',
   '🐭', '🔙', '🍼', '😕', '😺', '💽', '📯', '🔯', '🗄', '🥳', '🧡', '🐔', '💛',
   '📹', '🎾', '🥒', '🔗', '🍡', '👧', '💬', '🈸', '🏰', '🔷', '🛁', '🧈', '🙁',
   '🕑', '💩', '🪶', '🌎', '🪑', '📬', '🌁', '🐦', '🎇', '🍻', '🛥', '👻', '🎩',
   '🗑', '🎯', '💔', '🦱', '🐖', '🚤', '🧞', '🐝', '🉑', '🥌', '🧭', '👕', '🛀',
   '🦿', '🧏', '🕝', '🎻', '💸', '📁', '🕔', '😖', '🍁', '😥', '🦀', '🍚', '🎑',
   '💉', '👗', '🖖', '🦞', '🔁', '🧥', '🩳', '🪵', '🔚', '🔴', '🚝', '🤰', '🌄',
   '📛', '🤴', '🍣', '🀄', '🎈', '📨', '🍢', '🕊', '🥡', '👍', '🐌', '🕥', '🚙',
   '🖨', '👫', '👀', '🥂', '🌘', '🤕', '🔻', '🥷', '🕐', '🛄', '💭', '🎚', '🎟',
   '👥', '🏷', '🚊', '🎒', '🥟', '🎶', '🕋', '🕞', '🆓', '🤝', '🏌', '🪨', '🍠',
   '🛐', '🥖', '👸', '🤦', '💨', '🪙', '🪢', '🤽', '👬', '😣', '🔓', '🏔', '🗨',
   '🧠', '🚋', '🪃', '🛂', '🗼', '🙉', '💋', '📉', '🛕', '🤣', '🕠', '🧵', '📔',
   '🈵', '🎫', '🎖', '🕒', '🤲', '🪳', '🕣', '🥭', '🦄', '🏺', '🧣', '🫑', '🔅',
   '🫖', '🌐', '📿', '😘', '🔖', '🤑', '🐺', '🖥', '🛢', '🚳', '🧱', '💡', '🚸',
   '🧝', '🍓', '🕍', '🧢', '🆎', '🎬', '🥉', '🏹', '🐑', '💾', '🛹', '👊', '😁',
   '👝', '🐀', '🐽', '🏝', '🆑', '🟣', '🧉', '😃', '🏪', '👿', '🕦', '📮', '🚪',
   '📶', '🟢', '🤼', '🩹', '🔟', '🥸', '🤠', '👃', '🦧', '📅', '🪟', '🥱', '🚭',
   '🌴', '🐻', '💣', '📱', '🔝', '🕛', '😬', '🛴', '🤺', '🌭', '😓', '😡', '🧘',
   '🍀', '🗃', '🈷', '🗞', '🚟', '👖', '🤷', '🐷', '🕖', '🚧', '🍫', '😛', '🏓',
   '🦗', '👭', '🧍', '😀', '🐥', '🐋', '👟', '🤫', '🌆', '💆', '📆', '🕎', '🙌',
   '🔩', '🚐', '🐫', '📂', '😏', '🦰', '🔐', '🧟', '🟡', '🍷', '🧄', '💙', '🦙',
   '🥻', '🌔', '🎤', '🍪', '🔤', '🔪', '🙎', '🌼', '🤘', '😉', '😫', '💧', '🐚',
   '🧼', '🍦', '🔉', '😱', '🏉', '🔔', '🐗', '🕜', '🤟', '🪘', '💘', '😎', '💿',
   '💈', '😷', '🚬', '🤜', '🍥', '🍗', '🐼', '🔳', '😨', '🏎', '💴', '🐊', '💐',
   '🔛', '🐲', '🍴', '🦁', '🃏', '🐹', '🔹', '🛷', '🧳', '😋', '🔫', '🧯', '🪠',
   '🏬', '🪗', '🐨', '🔜', '🦺', '🔧', '🔬', '🎪', '🛤', '🧀', '🖇', '💗', '💪',
   '🥑', '🦸', '🍕', '📗', '🕓', '💦', '📘', '📦', '👹', '🌂', '🐧', '👄', '🎓',
   '🔂', '🛵', '🍉', '🥁', '🥞', '🦍', '📥', '💓', '🦵', '🪥', '💊', '🛰', '🐪',
   '🐂', '🙋', '🪣', '😆', '🆕', '🏣', '🚯', '🥏', '💲', '🪖', '👪', '😈', '😴',
   '🏞', '🚩', '🌉', '🚄', '🧑', '🪜', '🏀', '🕙', '🏦', '🔵', '🏡', '🏖', '😇',
   '🪁', '🎧', '🖐', '🌹', '🛅', '🍺', '🔠', '🍄', '🟫', '🚡', '🧸', '🅰', '🥕',
   '🥧', '🏕', '🐰', '🪲', '📙', '🙇', '🚱', '🤹', '🚹', '🦡', '👡', '🌨', '🔕',
   '🦽', '😝', '🎋', '🚓', '🍅', '🐢', '🥙', '🥾', '🫒', '👁', '🔱', '🚿', '🥃',
   '🥩', '🥿', '🔆', '🍽', '💇', '🚁', '🥯', '🚛', '🙀', '🪞', '📷', '🛶', '🎃',
   '🛍', '🚀', '🗝', '🍂', '🚕', '🤓', '🥜', '💻', '🏈', '🎏', '🥀', '🦭', '🔊',
   '🫓', '👾', '🐁', '🆔', '🧖', '🚘', '📭', '🕢', '🌟', '🧨', '🌇', '🪦', '🎽',
   '🚆', '🌋', '🏛', '👲', '🎍', '🍃', '🧕', '🧓', '🌽', '🏟', '😳', '🦫', '🥼',
   '🐉', '🦛', '🌛', '🎀', '😌', '🦈', '🌩', '🌷', '🏩', '🪤', '🚦', '🚽', '🌡',
   '🕶', '🛎', '🎦', '🈹', '👅', '🍍', '🧷', '🧺', '🐕', '📧', '🔄', '🌤', '🌯',
   '😒', '🍾', '🙄', '🩸', '🛌', '🔡', '📡', '👋', '🍰', '🧲', '🍨', '🐞', '💢',
   '🍵', '😵', '🟪', '🤏', '🧋', '🧰', '🎥', '🍆', '🎉', '🚲', '🈁', '🌦', '🛫',
   '🦏', '🧙', '📐', '🎅', '🌓', '📰', '🦬', '🏒', '😭', '📍', '🥛', '📵', '🟥',
   '🚜', '🎴', '🕵', '🪅', '🈶', '😚', '🧧', '🏄', '🧫', '🦂', '🤯', '🛻', '🌊',
   '🎎', '🤒', '🦻', '📼', '🍛', '🪒', '🟦', '🤩', '🐆', '🥝', '🔦', '📌', '🪀',
   '🏳', '🔮', '🛸', '🎿', '📲', '🛗', '🫂', '🙆', '🧪', '🚖', '🦐', '💞', '😰',
   '🈚', '😾', '🤥', '🥅', '🧎', '🌚', '🌑', '👔', '👽', '👦', '🏁', '😹', '🕌',
   '🎵', '🥰', '📸', '📝', '😯', '🔨', '🏧', '📴', '🌀', '🐈', '🐠', '🦴', '🏇',
   '🍞', '📠', '🕷', '🌮', '🐳', '😸', '🫔', '😲', '🥫', '🌏', '🉐', '🌅', '🎳',
   '📫', '🟤', '👯', '🐤', '🏚', '🥨', '🚏', '👤', '🚚', '👏', '🦕', '🦠', '🍭',
   '😦', '🐅', '🐟', '👘', '🚇', '🔒', '🥤', '🥲', '🏮', '📕', '📪', '🚅', '🥥',
   '🪄', '🐜', '🧇', '🌱', '😑', '😍', '🏠', '🏗', '🪆', '🍎', '🎨', '🤪', '🌙',
   '🐓', '🐮', '🦇', '🩰', '🔣', '🐴', '💱', '🦩', '💫', '🗾', '🎰', '🌈', '🪓',
   '🚈', '🍐', '🕰', '🛒', '🤳', '🍔', '🏂', '😅', '😐', '🛳', '💰', '😪', '🤞',
   '🦊', '🍜', '💒', '🤖', '🥈', '🔰', '🍯', '🏥', '🐐', '👇', '🌲', '👌', '😊',
   '🪧', '🌃', '🛏', '🅾', '🦢', '🌰', '🤸', '🐡', '🖌', '🍧', '🆚', '🛠', '🤚',
   '🧂', '🥇', '🎄', '🌿', '👷', '🎱', '😟', '🏨', '🚺', '🟨', '🍩', '🛼', '🎢',
   '👐', '🍱', '🐱', '🪂', '🗒', '🎲', '🌝', '🫕', '💶', '🥮', '🙏', '👼', '🎁',
   '😽', '🤨', '🧛', '🔞', '🙅', '🎙', '🈴', '🍋', '🍙', '🏊', '🏤', '🤐', '🪝',
   '🎮', '🥽', '📳', '🦓', '💁', '🚷', '🗿', '🦔', '🙃', '🌸', '🍌', '🙈', '🧿',
   '🎂', '💥', '🌵', '🐸', '📚', '🏴', '🕯', '🦘', '👆', '🎠', '🐬', '🦚', '🕧',
   '🌺', '🪡', '👵', '🕳', '🍒', '🎞', '💯', '🕡', '💳', '🌫', '🎡', '🚍', '🔎',
   '💍', '🛑', '🥪', '🥎', '🎛', '📃', '🔸', '🖋', '🚨', '🤵', '😂', '🎌', '🦎',
   '🤤', '🕘', '🚵', '🈲', '🆘', '🎆', '👞', '🚒', '💌', '💚', '🤶', '😄', '🦾',
   '🫁', '🐄', '💄', '💷', '🍘', '🧆', '🍤', '🧹', '🦉', '👓', '😮', '😻', '🩺',
   '🚃', '🍮', '😞', '🏫', '🐒', '💕', '🕉', '🧒', '🧬', '🤮', '🐃', '🐵', '🧐',
   '👎', '💅', '🦑', '🪰', '🎷', '🎐', '🦝', '🔏', '🏙', '👳', '🛩', '🈳', '🤗',
   '🧻', '🌜', '🥬', '🍈', '🌌', '🧶', '🌶', '💂', '🛖', '🌳', '🌬', '🖼', '👰',
   '👺', '🕗', '👠', '🦦', '🐿', '🍏', '🐍', '🈂', '🎼', '🕸', '🕟', '💝', '🆖',
   '🤍', '🧗', '🥄', '🔍', '🤡', '🏯', '🥓', '🦤', '🐙', '🍶', '🫀', '📢', '🏜',
   '🌠', '🦆', '🕕', '🔘', '🧩', '🐘', '🆙', '👴', '🆒', '🏃', '📟', '🐩', '🗳',
   '🐾', '👒', '💏', '🔲', '🗽', '🗣', '🎹', '🙊', '🏘', '🚞', '🏅', '🚾', '🦪',
   '🎊', '🏐', '🪔', '🚥', '🤿', '🌥', '🪴', '🦜', '🦲', '👩', '🖍', '💟', '😶',
   '👢', '🦮', '💹', '🕤', '🗜', '😜', '🧦', '🦷', '🥣', '🌧', '🤢', '🍸', '🌍',
   '🐯', '🗂', '🛣', '🗓', '🍑', '🖲', '🧾', '📎', '💀', '🔀', '🚻', '🤛', '🥔',
   '🚴', '💃', '🚣', '🦥', '💺', '🍹', '🎭', '😢', '🤱', '🦌', '🕴', '👣', '🔽',
   '🤧', '🥦', '🧊', '🟧', '🥺', '🌕', '🛃', '📄', '🖊', '🍖', '🐎', '🟩', '🏍',
   '🥴', '🧅', '💖', '🪚', '💑', '🍲', '🔼', '🤭', '🩱', '🏑', '🤎', '📩', '🤬',
   '🚑', '🏋', '🕹', '📣', '🟠', '🧃', '🪱', '🥚', '📞', '💼', '💤', '🐶', '🅿',
   '📏', '🤾', '🆗', '🔃', '🧚', '👑', '🦯', '📈', '🦒', '🔇', '🏢', '🚠', '🥊',
   '😿', '😔', '🍬', '🐣', '📜', '🤙', '🥗', '🔶', '🔢', '🌾', '🏵', '📽', '📀',
   '📒', '🥘', '📤', '🦅', '🫐', '🪐', '🦃', '😩', '📊', '🕺', '🌒', '🚎', '🚗',
   '🈺', '🛋', '🧁', '🧮', '🚮', '🧔', '👉', '📋', '📖', '💮', '🖤', '👨', '🥢',
   '🖱', '🦖', '😗', '🤌', '🦟', '🎺', '👜', '🔥', '🗡', '🥶', '🩲', '👙', '🏭',
   '🚢', '🚂'}

# SRC-20 BTC Transaction Specifications

```BASH
# bitcoin-cli getrawtransaction 50aeb77245a9483a5b077e4e7506c331dc2f628c22046e7d2b4c6ad6c6236ae1 true
```

```JSON
{
  "txid": "50aeb77245a9483a5b077e4e7506c331dc2f628c22046e7d2b4c6ad6c6236ae1",
  "hash": "d045be2dc4647d92c1327fbd5572e6c7024f00f1e991b833f38cbdfb1a19577c",
  "version": 2,
  "size": 451,
  "vsize": 369,
  "weight": 1474,
  "locktime": 0,
  "vin": [
    {
      "txid": "6005ee8cc02e528e20c8e5ff71191723b0260391020862a03587a985f813dabe",
      "vout": 2,
      "scriptSig": {
        "asm": "",
        "hex": ""
      },
      "txinwitness": [
        "3045022100bd8c27473a5a82cc9085af4fd530ffbcb8642fda04689ac27ecefa01287f54e5022040af2daafaa1bedd6f80ee9d751cc88c12de8f8e65b33222c432d066c8cecbd801",
        "0314beffca49f214014cccdc0e1f7259aa1a5eeaaa34da1a4fd807e16fea3a86b0"
      ],
      "sequence": 4294967295
    }
  ],
  "vout": [
    {
      "value": 0.00000555,
      "n": 0,
      "scriptPubKey": {
        "asm": "0 afdcc32a2778ebd36c4859c7301bb4c32cb59f93",
        "desc": "addr(bc1q4lwvx2380r4axmzgt8rnqxa5cvktt8unqlnka6)#3yzckyj0",
        "hex": "0014afdcc32a2778ebd36c4859c7301bb4c32cb59f93",
        "address": "bc1q4lwvx2380r4axmzgt8rnqxa5cvktt8unqlnka6",
        "type": "witness_v0_keyhash"
      }
    },
    {
      "value": 0.00000888,
      "n": 1,
      "scriptPubKey": {
        "asm": "1 03c46b73fe2ff939bea5d0a577950dc8876e863bed11c887d681417dfd70533e51 039036c8182c70770f8f6bd702a25c7179bfff1ccb3a844297a717226b88b976cc 020202020202020202020202020202020202020202020202020202020202020202 3 OP_CHECKMULTISIG",
        "desc": "multi(1,03c46b73fe2ff939bea5d0a577950dc8876e863bed11c887d681417dfd70533e51,039036c8182c70770f8f6bd702a25c7179bfff1ccb3a844297a717226b88b976cc,020202020202020202020202020202020202020202020202020202020202020202)#jjleg3k0",
        "hex": "512103c46b73fe2ff939bea5d0a577950dc8876e863bed11c887d681417dfd70533e5121039036c8182c70770f8f6bd702a25c7179bfff1ccb3a844297a717226b88b976cc2102020202020202020202020202020202020202020202020202020202020202020253ae",
        "type": "multisig"
      }
    },
    {
      "value": 0.00000888,
      "n": 2,
      "scriptPubKey": {
        "asm": "1 02dc054e58b755f233295d2a8759a3e4cbf678619d8e75379e7989046dbce16be3 02932b35a45d21395ac8bb54b8f9dae3fd2dbc309c24e550cf2211fe6aa897e5ca 020202020202020202020202020202020202020202020202020202020202020202 3 OP_CHECKMULTISIG",
        "desc": "multi(1,02dc054e58b755f233295d2a8759a3e4cbf678619d8e75379e7989046dbce16be3,02932b35a45d21395ac8bb54b8f9dae3fd2dbc309c24e550cf2211fe6aa897e5ca,020202020202020202020202020202020202020202020202020202020202020202)#x8agrm2s",
        "hex": "512102dc054e58b755f233295d2a8759a3e4cbf678619d8e75379e7989046dbce16be32102932b35a45d21395ac8bb54b8f9dae3fd2dbc309c24e550cf2211fe6aa897e5ca2102020202020202020202020202020202020202020202020202020202020202020253ae",
        "type": "multisig"
      }
    },
    {
      "value": 0.00345194,
      "n": 3,
      "scriptPubKey": {
        "asm": "0 cc1d6448d6879b3e260829d9a31717beb772186e",
        "desc": "addr(bc1qeswkgjxks7dnufsg98v6x9chh6mhyxrwrvdktf)#km4m4l32",
        "hex": "0014cc1d6448d6879b3e260829d9a31717beb772186e",
        "address": "bc1qeswkgjxks7dnufsg98v6x9chh6mhyxrwrvdktf",
        "type": "witness_v0_keyhash"
      }
    }
  ],
  "hex": "02000000000101beda13f885a98735a0620802910326b023171971ffe5c8208e522ec08cee05600200000000ffffffff042b02000000000000160014afdcc32a2778ebd36c4859c7301bb4c32cb59f93780300000000000069512103c46b73fe2ff939bea5d0a577950dc8876e863bed11c887d681417dfd70533e5121039036c8182c70770f8f6bd702a25c7179bfff1ccb3a844297a717226b88b976cc2102020202020202020202020202020202020202020202020202020202020202020253ae780300000000000069512102dc054e58b755f233295d2a8759a3e4cbf678619d8e75379e7989046dbce16be32102932b35a45d21395ac8bb54b8f9dae3fd2dbc309c24e550cf2211fe6aa897e5ca2102020202020202020202020202020202020202020202020202020202020202020253ae6a44050000000000160014cc1d6448d6879b3e260829d9a31717beb772186e02483045022100bd8c27473a5a82cc9085af4fd530ffbcb8642fda04689ac27ecefa01287f54e5022040af2daafaa1bedd6f80ee9d751cc88c12de8f8e65b33222c432d066c8cecbd801210314beffca49f214014cccdc0e1f7259aa1a5eeaaa34da1a4fd807e16fea3a86b000000000",
  "blockhash": "00000000000000000005304641c363ce12d8a2a3b98c81d6b8b721cb37f66dfa",
  "confirmations": 1999,
  "time": 1686278106,
  "blocktime": 1686278106
}
```

The owner of the first input is considered the owner / source of the transaction
| `vin[0].prevout.hash[::-1]`

The first `vout` output `0` is the destination address for a transfer
`"address": "bc1q4lwvx2380r4axmzgt8rnqxa5cvktt8unqlnka6"`

For mint and deploys `vout-0` is the minter/deployer address

The components of the multisig `ScriptPubKeys` are:

- `1`: This is the number of required signatures for the transaction to be
  valid. Always 1 (of 3) for SRC-20 (1 sigop)
- `03c46b73fe2ff939bea5d0a577950dc8876e863bed11c887d681417dfd70533e51`: This is
  the SRC-20 encoded data
- `039036c8182c70770f8f6bd702a25c7179bfff1ccb3a844297a717226b88b976cc`: This is
  the SRC-20 encoded data
- `020202020202020202020202020202020202020202020202020202020202020202`: This is
  the hash that must be to a valid keyburn address.
- `3`: This is the total number of public keys in the multisig script. Always (1
  of) 3 for SRC-20
- `OP_CHECKMULTISIG`: opcode

We will also use an additional mulisig script in the decoding example below.
Additional multisig scripts may be added depending on the length of the JSON
string.

# Decoding the SRC-20 Bitcoin Transaction

Take the first two pubkeys from all present multisig scripts. In this example
there are a total of 4 hex strings in the two scripts.

```
03c46b73fe2ff939bea5d0a577950dc8876e863bed11c887d681417dfd70533e51 039036c8182c70770f8f6bd702a25c7179bfff1ccb3a844297a717226b88b976cc
02dc054e58b755f233295d2a8759a3e4cbf678619d8e75379e7989046dbce16be3 02932b35a45d21395ac8bb54b8f9dae3fd2dbc309c24e550cf2211fe6aa897e5ca
```

First we strip the sign and nonce bytes (first and last bytes from each string)
which leaves.

```
c46b73fe2ff939bea5d0a577950dc8876e863bed11c887d681417dfd70533e 9036c8182c70770f8f6bd702a25c7179bfff1ccb3a844297a717226b88b976
dc054e58b755f233295d2a8759a3e4cbf678619d8e75379e7989046dbce16b 932b35a45d21395ac8bb54b8f9dae3fd2dbc309c24e550cf2211fe6aa897e5
```

The strings are then concatenated and decoded using ARC4 decoding, which uses
the `vin[0].prevout.hash[::-1]` as the signing key.

The output after ARC4 decoding is:

```
00457374616d703a7b2270223a227372632d3230222c226f70223a227472616e73666572222c227469636b223a225354455645222c22616d74223a22313030303030303030227d0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
```

The first two bytes - in this example `0045` is the expected length of the
decoded data in hex (less any trailing zeros) for data validation. This is
required in order for the transaction to successfully parse and be indexed.
Transactions without this value or a value that does not match the string length
are considered invalid.

The next `7374616d703a` is the hexadecimal representation of `stamp:` in
lowercase - this is required for a valid stamp SRC-20 transaction

The remaining string is the SRC-20 JSON data.

```
7b2270223a227372632d3230222c226f70223a227472616e73666572222c227469636b223a225354455645222c22616d74223a22313030303030303030227d
```

Which UTF-8 decodes to:

`{"p":"src-20","op":"transfer","tick":"STEVE","amt":"100000000"}`

In order to minimize the transaction size spaces are not used in the serialized
JSON string which is constructed by the SRC-20 reference wallet.

# Compression

Compression and data serialization is supported in SRC-20 transactions.
Previously SRC-20 was a JSON Strings encoded in BASE64 inside of a Counterparty
issuance transaction. In some cases the json string was serialized and
compression was utilized to minimize the size of the corresponding transaction.
This is an important factor when indexing and validating prior SRC-20
transactions within Counterparty transactions, and will continue to be supported
in current version SRC-20 transactions. However given the construction of the
JSON string without spaces, and the fact that we are no longer encoding in
BASE64 the transactißon size benefits are minimal. This must be taken into
consideration when parsing for transactions on chain.

An example of the serialization and compression:

```PY
# Note this string has line breaks and spaces so serialization and compression is worthwhile especially given that it was encoded in BASE64 which is 2x the size. 
data = {
    "p": "src-20",
    "op": "mint",
    "tick": "STAMP",
    "amt": "100000"
}

# Serialize the JSON String
serialized_data = msgpack.packb(data)

# Compress the serialized data using zlib
compressed_data = zlib.compress(serialized_data)
```

# Indexing for SRC-20 Transactions

SRC-20 transactions may be indexed directly from BTC for validation. Prior to
block 796,000 this can be accomplihed using Counterparty API's to pull
transaction details from valid issuances with a numeric asset with a valid json
string encoded in base64 with the multisig scripts to a valid keyburn address.
All transacitons on and after block 796,000 must be parsed directly from a BTC
node. The specifications above must be followed including valid json strings and
a valid Bitcoin Stamp transaction prefixed by 'stamp:'

## Tick Length

Python sees the text length differently than Node.JS. In the following example
we determine the char length using the python method.

Node: 'BULL🐂'.length = 6

Python: len('BULL🐂') = 5

# Base64 and other Decoding Anomolies

Python and Node.JS handle base64 decoding differently. Prior to block 796,000
for CP based transactions which were base64 encoded this can have an impact on
valid/invalid transactions. After block 796,000 for direct to BTC transactions
which are ARC4 encoded this does not have an impact.

For example:

Transaction: `c129cc8f13760fce63a42257dbe5dcdd0aad798f858f6b08968c7834c7a1bcc7`

With base64 string:
`eyJwIjogInNyYy0yMCIsICJvcCI6ICJtaW50IiwgInRpY2siOiAiUElaWkEiLCAiYW10IjogIjExMTExIn0`

This string is considered invalid in Python using
`base64.b64decode(base64_string)` and `pybase64.b64decode(base64_string)` and in
bash `printf "%s" "{base64_string}" | base64 -d` because it is missing the end
of line `=` for padding / newline. The original indexer was written in python
with these 3 checks so it is deemed invalid even though Node.JS interprets this
string properly. Padding was attempted in prior iterations to attempt to include
improperly formatted base64 strings into BTC Stamps protocol however since it is
not possible to properly determine the location for padding in all cases these
were simply deemed invalid to remove malformed data.

Also, Transaction
`f3a8df9f71bd195b43186c669666732fa86623e2d2f9633cf663b32e5e417b69` at the time
of block 796000 was parsing as an SRC-20 transaction when pulled directly off
Bitcoin. However on 3 Counterparty nodes the transaction parsed as shown below.
Due to the requirements of SRC-20 Transactions being a valid counterparty
transaction prior to the specified block this transaction was deemed invalid.
This may be a bug in Counterparty which was unable to be addressed for final
validation so this was excluded. This is documented for future indexing
validation. The original transaction was a Bitcoin Stamp, however the same
Counterparty asset name was used for the second transacion was intended to be a
JSON string for a SRC-20 token. This is against protocol specifications where a
previously existing stamp on the asset cannot be changed.

```
9575037|791071|insert|issuances|{"asset": "A5428699716173256069", "asset_longname": null, "block_index": 791071, "call_date": 0, "call_price": 0.0, "callable": false, "description": "STAMP:iVBORw0KGgoAAAANSUhEUgAAACgAAAA4BAMAAAB9BqfFAAAAJ1BMVEVIZZcqRnYNERg8Qj4gJSEiLEojOFsAAAD7AQkeGx7///+SoYxUaWqIxi3EAAABTklEQVQ4y73PsU7DMBQF0FSiA6MHilg7lA8IEhmRcCR+wIq8MpQvQE8xYxrFaVkzpBuVoAM7/B7XcRrH1EJMvapk++jd1zaaB3I6XD6GEDFOO+Uj+JqIdr0tgF0o3+bb+cI+otkB63yN0yKz5xPqyiEDA/O2/XCIYAW9aK03Xw6RS9p/a20XsNmAij439MaW5tUjM1gB2QgvMqL3I2wyJSrFfBRCNCX7jTKAEqN1CN1kNDHHlUDfIQIHCg8RU5ejnTbTbnLiY3SOpSX2eDiVmOxuYxQS6AXYiADiv/8XQ3UZ3BlGeYyNDKBoQ3X5B55xh2nTfxHng/LU/CTeB+87VHjalKIe0B6YzJ5LvuIPHmZ7oD+5SjOlfESAVKJsMY7jG3OpFK144tBwfLumIsFlwASfRBWFjgt+Dwf2KbR+Lez1gKhqjYaHWABy6NhhID/iStgdKGHcpQAAAABJRU5ErkJggg==", "divisible": false, "fee_paid": 0, "issuer": "1WweVUK8kLmSNt6yKKqwVxch3Z7Lw5HAY", "locked": true, "quantity": 100, "reset": false, "source": "1WweVUK8kLmSNt6yKKqwVxch3Z7Lw5HAY", "status": "valid", "transfer": false, "tx_hash": "934dc31e690d0237d8d0d6a69355a7448920dbd12ff21abf694af48cfb30d715", "tx_index": 2387617}|1684859820

9581330|791180|insert|issuances|{"asset": "A5428699716173256069", "asset_longname": null, "block_index": 791180, "call_date": 0, "call_price": 0.0, "callable": false, "description": "STAMP:iVBORw0KGgoAAAANSUhEUgAAACgAAAA4BAMAAAB9BqfFAAAAJ1BMVEVIZZcqRnYNERg8Qj4gJSEiLEojOFsAAAD7AQkeGx7///+SoYxUaWqIxi3EAAABTklEQVQ4y73PsU7DMBQF0FSiA6MHilg7lA8IEhmRcCR+wIq8MpQvQE8xYxrFaVkzpBuVoAM7/B7XcRrH1EJMvapk++jd1zaaB3I6XD6GEDFOO+Uj+JqIdr0tgF0o3+bb+cI+otkB63yN0yKz5xPqyiEDA/O2/XCIYAW9aK03Xw6RS9p/a20XsNmAij439MaW5tUjM1gB2QgvMqL3I2wyJSrFfBRCNCX7jTKAEqN1CN1kNDHHlUDfIQIHCg8RU5ejnTbTbnLiY3SOpSX2eDiVmOxuYxQS6AXYiADiv/8XQ3UZ3BlGeYyNDKBoQ3X5B55xh2nTfxHng/LU/CTeB+87VHjalKIe0B6YzJ5LvuIPHmZ7oD+5SjOlfESAVKJsMY7jG3OpFK144tBwfLumIsFlwASfRBWFjgt+Dwf2KbR+Lez1gKhqjYaHWABy6NhhID/iStgdKGHcpQAAAABJRU5ErkJggg==", "divisible": false, "fee_paid": 0, "issuer": "1NwCmg8gZW7KykrA7mX16zugNZZuckPg5o", "locked": true, "quantity": 0, "reset": false, "source": "1WweVUK8kLmSNt6yKKqwVxch3Z7Lw5HAY", "status": "valid", "transfer": true, "tx_hash": "f3a8df9f71bd195b43186c669666732fa86623e2d2f9633cf663b32e5e417b69", "tx_index": 2390355}|1684931053
```

1. Field Validation Rules

  ## Field Validation

  ### Required Fields
  - **DEPLOY**: `p`, `op`, `tick`, `max`, `lim`
  - **MINT**: `p`, `op`, `tick`, `amt`
  - **TRANSFER**: `p`, `op`, `tick`, `amt`

  ### Optional Fields
  - **dec**: Decimal places (0-18, defaults to 18 if omitted)

  ### Field Format Requirements

  #### Protocol Field (`p`)
  - **Value**: "SRC-20" (case insensitive)
  - **Type**: String
  - **Required**: Yes

  #### Operation Field (`op`)
  - **Values**: "DEPLOY", "MINT", "TRANSFER" (case insensitive)
  - **Type**: String
  - **Required**: Yes

  #### Ticker Field (`tick`)
  - **Length**: 1-5 characters
  - **Allowed characters**: [Define allowed character set from TICK_PATTERN_SET]
  - **Type**: String (converted to lowercase)
  - **Required**: Yes

  #### Numeric Fields (`max`, `lim`, `amt`)
  - **Format**: Numeric string or number
  - **Range**: 0 to 2^64-1 (uint64 maximum)
  - **Decimals**: Must respect token's decimal specification
  - **Scientific notation**: Not allowed
  - **Negative values**: Not allowed

  #### Decimal Field (`dec`)
  - **Range**: 0-18 (integers only)
  - **Type**: Numeric string or integer
  - **Default**: 18 (when omitted)
  - **Invalid formats**: Mixed alphanumeric (e.g., "8a"), negative values

  2. JSON Format Requirements

  ## JSON Format Requirements

  ### Valid JSON Structure
  - Must be valid JSON syntax
  - Field names must be quoted
  - String values must be quoted
  - Trailing commas are accepted (implementation-dependent)

  ### Invalid Formats That Will Be Rejected
  - Missing closing braces: `{"p": "SRC-20", "op": "DEPLOY"`
  - Unquoted keys: `{p: "SRC-20", op: "DEPLOY"}`
  - Invalid field values: Mixed alphanumeric in numeric fields

  ### Case Sensitivity
  - Protocol field (`p`) is case insensitive: "SRC-20", "src-20" both valid
  - Operation field (`op`) is case insensitive: "DEPLOY", "deploy" both valid
  - Ticker field (`tick`) is converted to lowercase for consistency

  3. Validation Levels

  ## Validation Levels

  SRC-20 tokens undergo two levels of validation:

  ### Stamp Validation (Basic)
  - Valid JSON syntax
  - Required fields present
  - Basic format compliance
  - **Result**: Determines if transaction creates a valid Bitcoin stamp

  ### SRC-20 Protocol Validation (Strict)
  - Numeric field format validation
  - Range checking (uint64 limits)
  - Decimal precision validation
  - Business logic validation (sufficient balance, token deployed, etc.)
  - **Result**: Determines if stamp represents a valid SRC-20 operation

  ### Validation Outcomes
  - **Stamp Success + SRC-20 Success**: Valid SRC-20 operation
  - **Stamp Success + SRC-20 Failure**: Valid stamp, invalid SRC-20 (preserved for analysis)
  - **Stamp Failure**: Invalid stamp, not indexed

  4. Edge Cases and Error Handling

  ## Edge Cases and Error Handling

  ### Numeric Field Edge Cases
  - **Maximum values**: 18,446,744,073,709,551,615 (2^64-1)
  - **Zero values**: Rejected in required numeric fields
  - **Decimal precision**: Must not exceed token's decimal specification
  - **String numeric values**: Accepted and converted (e.g., "1000" → 1000)

  ### Decimal Field Special Cases
  - **Missing decimal field**: Defaults to 18 decimal places
  - **Invalid decimal values**:
    - Values > 18: Rejected
    - Non-numeric characters: Rejected (e.g., "8a", "1.5")
    - Negative values: Rejected

  ### Ticker Field Validation
  - **Empty ticker**: Rejected
  - **Length > 5**: Rejected
  - **Invalid characters**: [Specify based on TICK_PATTERN_SET]
  - **Unicode/Control characters**: Rejected

  ### Business Logic Validation
  - **DEPLOY**: Must not already exist
  - **MINT**: Token must be deployed, amount within limits
  - **TRANSFER**: Sufficient balance required

  5. Implementation Notes

  ## Implementation Notes

  ### Database Considerations
  - Field naming: JSON uses `dec`, database may use `deci` (reserved word handling)
  - Default values: Missing `dec` field defaults to 18 in database
  - Invalid tokens: Failed SRC-20 validations are preserved as stamps for analysis

  ### Backward Compatibility
  - Existing tokens without `dec` field remain valid (default to 18)
  - Case insensitive protocol handling maintains compatibility
  - Lenient JSON parsing (trailing commas) for broader compatibility

  ### Precision Handling
  - Numeric values are quantized for `max` and `lim` fields (rounded down)
  - Amount fields preserve decimal precision up to token specification
  - Scientific notation is rejected to prevent precision ambiguity
