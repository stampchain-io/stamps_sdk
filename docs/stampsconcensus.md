# Bitcoin Stamps Indexing Consensus Changes

Bitcoin Stamps has undergone several consensus changes that impacted Stamp
numbering since its inception. Knowing these changes it is possible for anyone
to parse Bitcoin transactions and derive Stamp numbers.

These changes are documented here for reference.

While the basis of Stamped images relying on the Counterpart transaction
construction on BTC has remained the same, the addition of SRC-20, SRC-721, and
other features have necessitated changes to the consensus rules. The following
is a list of consensus changes that have occurred on Bitcoin Stamps that
impacted Stamp numbering when indexed off Bitcoin.

# Protocol Starting Blocks

BTC is not indexed prior to these blocks for Stamp transactions.

### Block Height Of First Valid Stamp Transaction via Counterparty Tx Format

`CP_STAMP_GENESIS_BLOCK = 779652`

---

### Block Height Of First SRC-20 Token via Counterparty Tx Format

`CP_SRC20_GENESIS_BLOCK = 788041`

---

### Block Height Of First SRC-721 Token via Counterparty Tx Format

`CP_SRC721_GENESIS_BLOCK = 792370`

---

### Block Height Of First SRC-20 Token On Bitcoin w/o Counterparty Tx Format

Outside of Counterparty Transaction Format

As of this block Stamp numbering consists of both Counterparty and
non-Counterparty transaction types. `BTC_SRC20_GENESIS_BLOCK = 793068`

---

<br/>

# Consensus Changes

### Block Height of the last SRC-20 Token on Counterparty

All SRC-20 type transactions on Counterparty are ignored after this block.

`CP_SRC20_END_BLOCK = 796000`

---

### BMN Audio File Support

Previously these would have been considered cursed stamps. After this block they
are included in Stamp numbering.

`CP_BMN_FEAT_BLOCK_START = 815130 # BMN`

---

### P2WSH OLGA Encoded Transactions

Support OLGA encoded Stamps to be included in the numbering.

`CP_P2WSH_FEAT_BLOCK_START = 833000`

---

### SRC-721 Token Supply Increase

Allow SRC-721 tokens to have a Counterparty asset supply > 1. Prior to this
block SRC-721 tokens that had a Counterparty supply of < 1 were not included in
numbering. The requirement for keyburn and locked is maintained.

`INCR_SRC721_SUPPLY = 844269`

---

### Strip Whitespace from Base64 Strings

After this block we attempt to strip whitespace from the derived base64 strings.
Example: 'STAMP: iVBORx..' becomes 'STAMP:iVBORx..'

`STRIP_WHITESPACE = 797200`

---

### Stop Base64 Repair

Prior to this block we attempted to repair base64 strings that were missing
padding and were not a multiple of 4. This attempt to repair malformed Base64
was inconsistent, however to maintain the repaired Stamps in numbering
historically this was just deprecated moving forward

`STOP_BASE64_REPAIR = 784550`

Example of attempting Base64 repair:

```
        missing_padding = len(base64_string) % 4
        if missing_padding:
            base64_string += '=' * (4 - missing_padding)

        image_data = base64.b64decode(base64_string)
```

---
