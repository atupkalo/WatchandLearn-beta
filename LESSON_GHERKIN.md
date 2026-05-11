# Lesson Gherkin

```gherkin
Feature: Language Learning — Lessons

Scenario: Viewing the lessons page
Given the user is logged in
When the user navigates to the Lessons page
Then a top bar is visible containing a search field and filter controls
And the lesson list is displayed in a scrollable container bounded by page height
And each lesson is represented by a card showing:
  | Field     |
  | Thumbnail |
  | Name      |
  | Duration  |
  | Level     |
  | Category  |
  | Type      |

Scenario Outline: Filtering lessons by level
Given the user is on the Lessons page
When the user selects level "<level>" from the Level filter
Then only lessons matching that level are shown

Examples:
  | level |
  | A1–A2 |
  | A2–B1 |
  | B1–B2 |
  | B2–C1 |

Scenario Outline: Filtering lessons by category
Given the user is on the Lessons page
When the user selects category "<category>" from the Category filter
Then all lessons that include "<category>" among their categories are shown

Examples:
  | category       |
  | Conversational |
  | Slang          |
  | Business       |
  | Medical        |
  | IT             |
  | Technical      |

Scenario Outline: Filtering lessons by duration
Given the user is on the Lessons page
When the user selects duration "<duration>" from the Duration filter
Then only lessons within the "<range>" second range are shown

Examples:
  | duration | range   |
  | Short    | 0–20 s  |
  | Medium   | 21–40 s |
  | Long     | 41–60 s |

Scenario Outline: Filtering lessons by type
Given the user is on the Lessons page
When the user selects type "<type>" from the Type filter
Then only lessons of that type are listed

Examples:
  | type      |
  | Movie     |
  | TV Show   |
  | Interview |
  | Animation |
  | AI made   |

Scenario: Searching lessons by name
Given the user is on the Lessons page
When the user types a character sequence into the search field
Then the lesson list updates automatically without a page reload
And only lessons whose names start with the typed sequence are displayed

Scenario: Lesson card hover interaction
Given the user is on the Lessons page
When the user hovers over a lesson card
Then the card background changes
And a subtle drop shadow appears on the card

Scenario: Navigating to a lesson from the list
Given the user is on the Lessons page
When the user clicks a lesson card
Then the system navigates to the selected lesson's page

# SINGLE LESSON PAGE

Scenario: Viewing a lesson page
Given the user has selected a lesson from the Lessons page
When the system navigates to the lesson page
Then the top bar displays: name, level, category, duration, and type
And a video player is visible on the right side of the page
And a lesson description is shown below the video player in collapsed accordion
And the description is rendered in the user's active interface language

Scenario: Viewing the lesson script
Given the user is on the lesson page
Then the lesson script is displayed as a list of accordion components below the video player
And each accordion is collapsed by default
And each accordion header shows a line number and a chevron icon on the right

Scenario: Expanding a script line accordion
Given the user is on the lesson page
When the user clicks a script line accordion
Then the accordion expands to reveal three lines of text:
  | Content                                          |
  | Original script line                             |
  | Translation in the user's study language         |
  | Take-away note (only present if vocabulary/grammar |
  | of interest exists in that line)                 |

Scenario: Clicking a word in the script
Given the user is on the lesson page
When the user clicks a word in the script
Then a popover appears showing the word's translation in the study language
And an "Add to list" button is visible inside the popover

Scenario: Adding a word to the vocabulary list
Given a word popover is open
When the user clicks "Add to list"
Then the word is saved to the user's vocabulary list on the Vocabulary page

Scenario: Dismissing a word popover
Given a word popover is open
When the user clicks outside the popover or closes it
Then the popover is removed

# EXERCISE — EASY MODE

Scenario: Default exercise mode on lesson load
Given the user is on the lesson page
Then the exercise panel has three tabs: Easy, Medium, Hard
And the Easy tab is active by default

Scenario: Easy mode — displaying a script line
Given Easy mode is active
Then one script line is displayed with the line number
And one or more words are replaced by blank input fields
And beneath the line, three word-badge options are shown for each blank
And each badge displays dots on its right side to suggest drag-and-drop

Scenario: Easy mode — displaying a script with a short no blanksline
Given Easy mode is active
Then one script line is displayed with the line number
And one or more lines script has no blanks
Then the sustem must render another line while keep line with no blanks visible

Scenario: Easy mode — short line without blanks
Given Easy mode is active
And the current script line is too short to contain a blank
Then the following script line is displayed below the current line

Scenario: Easy mode — placing an incorrect word badge
Given Easy mode is active
When the user drags an incorrect badge into a blank
Then the system rejects the placement
And the blank input is highlighted with a red outline

Scenario: Easy mode — placing a correct word badge
Given Easy mode is active
When the user drags the correct badge into a blank
Then the system accepts the badge into the blank

Scenario: Easy mode — advancing to the next line automatically
Given Easy mode is active
When the user has correctly filled all blanks in the current line
Then the system advances to the next script line

Scenario: Easy mode — skipping a line with the Next button
Given Easy mode is active
And the current line is not the last line
When the user clicks "Next"
Then the system advances to the next line regardless of blank completion

Scenario: Easy mode — reaching the last line
Given Easy mode is active
When the last script line is displayed
Then the "Next" button is no longer shown
And a "Reset" button is displayed

Scenario: Easy mode — resetting the exercise
Given Easy mode is active and the last line is displayed
When the user clicks "Reset"
Then the exercise restarts from the first script line

# EXERCISE — MEDIUM MODE

Scenario: Switching to Medium mode
Given the user is in any exercise mode
When the user clicks the "Medium" tab
Then the exercise updates to show the full script listed line by line
And approximately 50% of words in the whole script are replaced by blank inputs

Scenario: Medium mode — validating an incorrect typed word
Given Medium mode is active
When the user types at least one character into a blank
And the user changes focus by clicking outside, tabbing away, or pressing Enter
Then the system validates the input
And the blank is highlighted with a red outline if the answer is incorrect

Scenario: Medium mode — accepting a correctly typed word
Given Medium mode is active
When the user types the correct missing word into a blank
And the user changes focus
Then the input becomes read-only and displays the correct word
And the read-only state persists until the user reloads the page
And the read-only state persists until the user navigates away and returns, or switches tabs and returns

Scenario: Resetting Medium mode by switching tabs
Given the user is in Medium mode mid-exercise
When the user switches to a different exercise tab
And the user switches back to "Medium"
Then the Medium mode exercise resets to its initial state

# EXERCISE — HARD MODE

Scenario: Switching to Hard mode
Given the user is in any exercise mode
When the user clicks the "Hard" tab
Then the exercise displays:
  | Element                                        |
  | A single text input                            |
  | An "I don't know" button adjacent to the input |
  | The full script as a punctuation-only schema   |
  | (all words replaced by dashes, e.g.            |
  | ——— , ——— ? ——— , ——— . ——— !)                  |

Scenario: Hard mode — real-time input validation (in progress)
Given Hard mode is active
When the user begins typing the required word into the input
Then if each typed character matches the expected word so far, the input has a blue outline
And if a typed character does not match, the outline changes to red

Scenario: Hard mode — completing a word
Given Hard mode is active
When the user has typed all characters of the required word correctly
Then the input outline turns green
And after 0.3 seconds the input clears
And the correctly typed word appears in its position within the punctuation schema
```
