# Quote popup and Outfit update

30 October 2026.

- Removed the services-side quote rail. The services section now spans the full content width; desktop browser measurements confirm matching section/container widths and zero forms inside services.
- All existing quote links open one shared native dialog containing the existing QuoteForm. Name, Phone, Email, Message, Send, validation and delivery endpoint are preserved.
- Verified desktop opening from hero and header quote links; close button, outside click and Escape dismissal; initial focus on Name; keyboard navigation to the close button; focus restoration to the triggering quote link; background scroll lock and restoration.
- Verified 390px mobile popup fits without horizontal overflow. The floating Call/Email bar hides while the popup is open and returns after dismissal. Screenshots: quote-popup-desktop.jpg and quote-popup-mobile.jpg.
- Replaced Bricolage Grotesque with Outfit through next/font. Browser computed heading font confirms Outfit. Inter remains the body font and all existing size tokens are retained.
- Lint, TypeScript, five existing tests and production build pass. No browser console errors observed. No new routes/dependencies or real form submissions.
- Production preview used port 3002 because port 3000 was occupied. The verification server was stopped after QA; the existing process on port 3000 was left alone. Use the current checkout's normal dev command to view the update.

Earlier Lighthouse reports describe earlier builds; Lighthouse was not rerun for this focused update.
