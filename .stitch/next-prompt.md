---
page: index
---
A high-fidelity Home Dashboard for AuditUs, a professional social polling platform. The page should feel premium, technical, and "wow" the user.

**DESIGN SYSTEM (REQUIRED):**
- **Brand Identity**: "Midnight Electric"
- **Primary Palette**: 
  - **Electric Indigo**: #4F46E5 (Actions, primary brand)
  - **Vivid Violet**: #8B5CF6 (Accents, secondary brand)
  - **Dark Surface**: #0F172A (For depth and contrast)
  - **Pure White**: #FFFFFF (For clarity)
- **Glassmorphism**: Use 15% opacity blurs (`backdrop-blur-xl`) for overlays and floating cards.
- **Background**: Soft Tinted Canvas (#F1F5F9) with a sharp, high-contrast Dot-Grid overlay (16px spacing, indigo-500 @ 8%).
- **Typography**: 
  - **Headlines**: Plus Jakarta Sans (Black/900). 
  - **Sub-headers**: Outfit (Bold/700). 
  - **Body**: Inter (Medium/500).
- **Component Patterns**:
  - **Cards**: 32px border-radius, double-border (Indigo @ 10% inner), and asymmetric padding.
  - **Navigation**: Minimal Top Bar + Glassmorphic Floating Bottom Dock (floats 24px above edge).

**Page Structure:**
1. **Header**: Minimal logo "AuditUs" in Indigo, next to a subtle "V5 Elite" badge. Right side shows user points (GEM emoji) and a high-fidelity avatar with a violet glow.
2. **Main Section**:
   - Welcome message: "Hola, Agente [Username]" in massive Plus Jakarta Sans.
   - Points/Streak Summary: A floating glassmorphic card showing points and current streak (FLAME emoji).
   - "Tus Grupos": A list of groups. Each group card includes an emoji, title, "En vivo" indicator (with pulse animation), and a tiny streak indicator.
3. **Actions**: 
   - A prominent floating "Crear nuevo grupo" pill button with a deep lavender-to-indigo gradient and sharp drop shadow.
4. **Navigation**: The floating glassmorphic bottom bar with icons for Home, Explore, Ranking, and Profile.

**Technical Note**: Ensure all interactive elements have unique IDs. Use Tailwind-like classes but keep the logic in the HTML structure.
