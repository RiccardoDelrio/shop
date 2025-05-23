# Project Communications and Guidelines

Hello everyone,  
We have created Slack channels for each team and uploaded the project brief to the Drive folder.  

[x] Please kindly communicate to us, **by the end of the afternoon**, your e-commerce product category and the list of extra features you wish to develop.  
Keep in mind that what you communicate must be maintained until the end of the project.  

The choice of category will influence both the visual aspect and the database structure, so make sure you fully understand the peculiarities of your choice.  

## Useful Questions to Define Your Idea

- What sentiment do you want to convey?
- Who is your target customer?  
- Which market are you targeting?  

---

## First SAL

[x] The first SAL is scheduled for **next Wednesday (07/05/2025, day after tomorrow)**.  
Attached you'll find the schedules for each team.  

We'll meet in the classroom, team by team.  
There will be a waiting room and we'll let you in as soon as we finish with the previous team, so it's better to respect the timing 😉.  

On SAL day, we'll review the database ER diagram together.  
**By tomorrow afternoon** we ask you to send us a screenshot of the diagram.

## Second SAL

By second SAL:

[x] complete the backend
[] finish the home page

---

## Tips for ER Diagram Design

- Use English names.  
- Write everything in lowercase.  
- Ensure that table and column names clearly describe their content.  
- Indicate the types of relationships.  

To create the diagram, we recommend using [drawsql.app](https://drawsql.app).  

---

## Important Communications

📢 **In case of any absences or delays to SAL meetings**, it's important that you communicate this information personally (where circumstances allow, of course).  
Make sure to do this in your team's Slack channel, remembering to tag us.  

🚀 We said it during the kickoff, we'll write it here too:  
These two weeks will be among the most formative of the entire journey.  
You'll discover how autonomous you've become and how much your analysis, evaluation, and development skills have grown.  

**Programming isn't about writing code, it's about creating solutions... be creative!**  

If you have questions or doubts, you can write to us in your team's channel, remembering to tag us.  

---

## Extra Milestones

1. **Dual Search Results View** (coefficient: 1)  
    - Ability to view search results in grid or list format.  

2. **Free Shipping** (coefficient: 1)  
    - Free shipping for orders above a minimum spending threshold.  

3. **Products on Sale** (coefficient: 2)  
    - Display products on sale with original and discounted prices.  
    - Ability to filter sale products on the search page.
    - WARNING: Price calculations should be moved to backend for security and consistency.
      Currently, pricing logic is duplicated across frontend components, creating potential
      security and maintenance issues.

4. **Welcome Popup** (coefficient: 3)  
    - Show a welcome popup only during the user's first visit.  
    - Allow collection of visitor's email.  
    - Send a thank you email.  

5. **Quantity Management** (coefficient: 3)  
    - Show available quantities on the detail page.  
    - Prevent out-of-stock products from being added to cart.  
    - Prevent checkout if a cart item becomes out of stock.

---

## Licensing Information

This project contains components under multiple licenses:

- Frontend components: MIT License
- Backend dependencies: Some components use Apache License 2.0 (denque, ecdsa-sig-formatter)
  - These are standard Node.js dependencies and their licenses do not affect the licensing of your project code
- Third-party UI components: MIT License and Font Awesome Free License

### Note for Students

This is an educational project. The different licenses in dependencies are common in software development and don't pose legal issues for educational purposes. However, understanding software licensing is an important skill for professional developers.

### Third-Party Components

- FontAwesome (Font Awesome Free License)
- Bootstrap (MIT License)
- React Router (MIT License)

Contributors should ensure new code is compatible with existing license requirements.

### Fixing License Compatibility Issues

If you see "Similar code found with 2 license types" warnings:

1. Make sure all components clearly indicate which third-party libraries they use
2. Add license attributions in comments at the top of each component file
3. Centralize pricing calculations in the backend as specified in milestone #3
4. When importing third-party components, use the correct package name (e.g., 'react-router-dom' not 'react-router')
5. Check for duplicate implementations that might have been copied from sources with different licenses
