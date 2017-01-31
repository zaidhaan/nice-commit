# Simple Commit
With Simple-Commit, you can commit in a more organized looking way!


## Installing
1. Clone the Repo
```
git clone https://github.com/TheVexatious/nice-commit.git
```
2. Go into that directory ( `cd nice-commit` ) and run `npm install` to install all the packages
3. Run `npm link` to globally install the CLI
4. Run `nice-commit --init`, Then it's all up to your preferences, Look at [initialization](#initalization) for some info on how to initialize it

###  Initialization
1. First it will ask you to pick a "[tag](#tag)" or "[emoji](#emoji)", pick whichever one you like.
2. It wil ask you to enter the tag/emoji, Enter as many as you like and when you're done, type "fin".
3. It will ask you whether you want commit descriptions, answer either "y" or "n"
4. If you answered yes on the previous question, it will ask you if it is required on every commit, if you answer yes, every time you commit, when it asks for a description you **must** write a description, if you answer no, then you can write a description if you want and just skip it by pressing enter, if you like.
5. And that's it!


#### Tag
 If you run nice-commit with the tag option, you will want to select the tag option and add a few tags like this:  
  ![image1](http://i.imgur.com/pPAlYqp.png)  

   and continue on initializing, when you run `nice-commit`, it will give you this:  
	![image2](http://i.imgur.com/l9Y7IC6.png)  
	in which "Tag 1" and "Tag 2" are tags that would be specified by you, When you select one of them, for example you select "Tag 1", after enter your commit message and optional description, your commit would be like this:  
   > [Tag 1] Commit Message
   >
   > Description


#### Emoji  
  If you want to use the emoji method, you would first select the emoji option, and add the tags as shown:
    ![image3](http://i.imgur.com/ECeKNG6.png)  
	as you see, it's not quite like the tag method, you will need to write with the following syntax: `:[emojiName]: = tag` where `emojiName` would be any [emoji](http://www.webpagefx.com/tools/emoji-cheat-sheet/) that you would like, and `tag` will

   after you finish initializing then, when you run `nice-commit` you should get something like this:
    ![image4](http://i.imgur.com/WCvvEtF.png)  
    from here, it's pretty apparent what will happen when you hit either of these, so for an example if you select "Update", after you enter your commit message and optional description, your commit would be like this:
   > [:star:] Commit Message
   >
   > Description  

   since the emoji for "Update" is `:star:` as shown in the example, when you select it it will put a star as the tag.
