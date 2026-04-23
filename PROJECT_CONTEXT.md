# Project Context

## Project Overview

- Product name: Watch and Learn
- Short description: A platform for Ukrainians to learn English through video lessons based on short clips from movies, TV shows, and other video content.
- Target users: Ukrainian users learning English, including both Ukrainian-speaking and Russian-speaking Ukrainians.
- Primary problem the product solves: This POC is meant to test the onboarding experience and the lesson experience, and to identify usability problems, blockers, and technical risks early.

## Vision

- Long-term vision: If the POC is successful, the next steps are to build a stronger user account experience and an admin panel for managing lessons and content.
- What success looks like: For this POC, success means building a smooth onboarding flow and a working lesson experience with around 5 lessons that users can complete without major issues.

## Current Stage

- Current stage: Skeleton building / early POC implementation
- What this repository is for: Building and testing the Watch and Learn proof of concept
- What is being tested right now: Onboarding, lesson experience, and overall product feasibility

## MVP Scope

- This project is currently a POC, not the full MVP.
- The main focus is onboarding and one strong lesson flow that can later scale into the MVP.

## Core User Flows

- Marketing flow: Users can visit the landing page and onboarding-related pages before entering the learning product.
- Onboarding flow: A simple onboarding flow that helps define interface language and study-language preferences.
- Lesson flow: The user picks a lesson, watches the clip, completes three difficulty levels, and can add unknown words to a vocabulary list.
- Logged-in app flow: Once logged in, the user should be in the app area and should not continue seeing the marketing experience as the main product shell.

## Product Areas

### Marketing

- Purpose: To introduce the product and support onboarding into the learning experience.
- Pages included: Landing page, onboarding page, and other marketing pages as needed later

### App

- Purpose: To test the core learning experience and the feasibility of the product idea.
- Pages included: Home, lessons, lesson detail, vocabulary, grammar, and pronunciation. For the POC, only onboarding and the lesson flow are the main priorities.

## Lesson Experience

- Lesson format: A lesson page consists of a video, lesson information, a lesson description, a lesson key, and a working field where the user completes the exercise.
- Difficulty levels:
  - Level 1: Drag and drop missing words into blank spots in the script.
  - Level 2: The user watches the video and types the missing words into inputs. Around half of the script is hidden.
  - Level 3: The script is not shown directly. Instead, the user sees only punctuation and structure hints and must type the correct words one by one.
- Lesson metadata: Level, genre, category (for example conversational English, business English, slang, IT, and so on), and lesson duration. Clips should stay short, with the longest being no more than about 1 minute.
- Lesson key contents: Original script, translation, and optional takeaways
- Supported learning interactions: Watching video, reading or reconstructing the script, typing answers, dragging and dropping answers, opening the lesson key accordion, and hovering over words to save them to vocabulary later

## Language Model

- Interface languages: English or Ukrainian
- Study languages: English-Ukrainian or English-Russian
- How language preference works: The interface language controls the product UI. The study language controls lesson translations and explanations. These are separate settings.

## Content Strategy

- Lesson source: Video comes from Mux, while lesson data is stored locally for the POC.
- Number of lessons in POC: Around 5 lessons
- Video provider: Mux
- Where lesson content is stored now: Local JSON or other local structured files in the project
- What may move to a database later: Lesson content, translations, takeaways, vocabulary data, and other user-related lesson progress data

## Tech Decisions

- Frontend: Next.js
- Backend: Full-stack Next.js for now, with room to expand later
- Auth: Supabase Auth
- Database: Supabase / Postgres later, but local lesson data for the POC
- Video: Mux
- Deployment: TBD

## Design Rules

- Fonts: Titillium Web for headings and Lato for body text
- Visual style: Desktop-first product with a clear distinction between marketing and app areas
- Desktop/mobile expectations: This POC is desktop-only. Mobile will be a separate mobile app later, with a similar interface and shared database.
- Things that should not be changed without approval: Anything related to the visual design, styles, brand direction, and approved UI decisions

## Engineering Notes

- Routing expectations: Marketing and app should be clearly separated. Logged-in users should use the app area rather than the marketing shell.
- Data-loading expectations: For the POC, lessons should be loaded from local structured data rather than a database.
- Temporary shortcuts allowed in POC: Use local lesson content, a limited number of lessons, and simplified empty placeholder pages for non-priority sections.
- Known technical constraints: Lesson data must be stored in a structured format that is easy to parse for all three lesson difficulty modes. The exact tokenization or parsing strategy is still TBD.

## Current Priorities

- Priority 1: Finish the project structure
- Priority 2: Complete the onboarding process
- Priority 3: Complete the lesson flow and lesson content
- Priority 4: Test the POC

## Open Questions

- What is the exact local data structure for lesson scripts, blanks, hints, translations, and takeaways?
- What should the final onboarding step include in the POC besides language selection?
- Which auth providers will be included in the POC versus later stages?

