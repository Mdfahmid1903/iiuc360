# Verification record

Verified locally in Chromium at widths 360, 390, 768 and 1440 pixels.

- Name/roll onboarding selects the intended sample semester.
- Bus stop selection updates Home; unknown areas show an explicit empty state.
- Publishing Halishahar 07:20 → 07:30 updates Transport and Home and survives reload.
- A future 07:45 publication stays inactive until the demo date reaches its effective date.
- Restoring the original bus version returns the displayed departure to 07:20.
- Class publication blocks missing rooms and overlapping time intervals.
- A valid class update changes both the daily routine and Home.
- Teacher name search, no-result state and department filtering work.
- Map asset loads, building search selects the library, and zoom changes the map transform.
- English/Bangla and light/dark choices survive reload.
- Main screens have no horizontal overflow at tested widths.
- Five Node domain tests cover roll mappings, stop lookup, publication validation, effective dates, group isolation and rollback precedence.

PDF text extraction is deliberately simulated. Actual phone/email delivery, location accuracy and university schedule accuracy are outside this assignment demo.
