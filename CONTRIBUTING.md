# Contributing

🎏 **Hey, welcome!**  This document should give you all the steps you need to make contributions to the Glitch community site. This guide applies to full time makers of Glitch as well as all members of our Glitch community.

📜 **Please read** our [code of conduct](https://glitch.com/edit/#!/community?path=CODE_OF_CONDUCT.md) and follow it in all your interactions with the project and the denizens thereof.

🎨 **Check out** our [style guide](https://glitch.com/edit/#!/community?path=STYLE.md) discussing our coding conventions, styles, and goals.

## Mission

Anyone in our community can feel welcome and supported in submitting improvements, fixes, and ideas to this Glitch community site.


## Philosophy

Our contribution flow is built around a hunger for creative expression. Build things fast, with Glitch, and share them.  Here's how:

1. You remix this site, play with it, and show us what you made! Tweeting [@Glitch](https://twitter.com/glitch) or posting to [our forum](https://support.glitch.com/) are good ways to get our attention.
2. We say something like "We like what you got, good job!"
3. Your changes (or something inspired by your changes) are prepared and make their way to our live production site.

This site is open source. All interactions between this site and Glitch-the-application are using public API endpoints-- there aren't any special privileges or secret endpoints going on.

This site is also young and hungry.  We don't have a public "bug list" and a lot of processes that are best to formalize have yet to be. And this site believes in a Glitchy future-- it is built, maintained, and deployed entirely within Glitch itself.  We're living the Glitchy future of web development, and it's a blast.

Accessible technologies are important to allowing people to contribute.  As we internally work on the code, we'll move incrementally towards ever-stronger documentation for the special pieces of this site and "boring"(easy to learn, perfectly fine) solutions for the standard components.

Behind the scenes, we'll make use of GitHub's Pull Request workflow to incorporate changes into the site. If you're a part of the GitHub community, then feel free to submit pull requests directly-- if you're not,  don't worry about it and just focus on building cool stuff and sharing your ideas.

## Contribution Workflow

First, remix from [https://glitch.com/~community](https://glitch.com/~community) into, e.g., `my-remix`

Next, make your changes.  When you've got something you like, share it with us (see above), and **you're all set**.

_If you're a core contributor or just really love Git, then read on._

### Pull Request Workflow

Ok cool, these next steps are what we'd do internally and you're welcome to follow them as well if you choose.  Beyond this point, there be 🐉s.

#### First Time Setup

_(Do this once per computer to create a local repository)_

_Remember to [set up Git SSH](https://help.github.com/articles/connecting-to-github-with-ssh/) or the [Windows Client](https://desktop.github.com/) to get your auth in order._

  ```
  # 1. On your local machine, clone our git repository from Github: 
  git clone git@github.com:FogCreek/Glitch-Community.git

  # 2. Inside of your new repo, add a remote endpoint for our live site:
  cd Glitch-Community
  git remote add live https://api.glitch.com/git/community
  ```
    
#### Creating a Pull Request

_(Do this once per remix/PR)_

We're going to add a branch named after your remix, and set up a remote endpoint pointed at its git repo in glitch.  We're using `my-remix` as a placeholder for your project name.  Swap that out in the scripts below.

In your local repository,
```
  # 1. Add your remix as remote source
  git remote add my-remix https://api.glitch.com/git/my-remix

  # 2. Fetch your remix into a new branch of the same name
  git fetch my-remix master:my-remix
  
  # 3. Switch to your new branch
  git checkout my-remix

  # 4. Push your branch to github
  git push origin my-remix
  
```

Or, run `./sh/setup.sh my-remix`.

Now you can use the GitHub UI to turn your branch into a pull request. 

It's good practice to share a link to your project in the PR and talk about the functional changes you've made.  This allows the reviewers to easily visit your remix to test out your new behavior.

_(Don't have permission to push to github? You'll need to first [Fork](https://blog.scottlowe.org/2015/01/27/using-fork-branch-git-workflow/) our [repository](https://github.com/FogCreek/Glitch-Community) and then [create a pull request from the fork](https://help.github.com/articles/creating-a-pull-request-from-a-fork/) instead.)_

#### Updating an Existing Pull Request

(Do this when you've made more changes in Glitch that you want to include in the PR.)

In your local repository,
 ```
   # 1. Make sure we're on the right branch
   git checkout my-remix 
   
   # 2. Pull from Glitch into your local branch.
   git pull my-remix master
   
   # 3. Update the PR in Github
   git push origin my-remix
 ``` 
 
 Or, run `./sh/update.sh my-remix`. 

And you're all set.

Keep your PR's small! (Days of work, not weeks.)  This will save you from having to think about and use all of the more advanced git hyjinks to keep your PR in sync with master (not documented here, because there would be _over 9000 🐉_'s. )

_Note: Glitch apps make git commits (we call them checkpoints) every 10 minutes. If you make some quick changes, they may not show up in your diff on the Github pull request. If that is the case, you can either wait several minutes for the checkpoint to be made, or toggle Glitch Rewind on-and-off (which will force a checkpoint)._

#### Updating a Glitch Remix from your local machine
Sometimes it's helpful to work on your local machine, then push your changes back to Glitch. To do this, run `./sh/update.sh my-remix` to get your changes to Github, then run `git pull my-remote my-remix` from your remix's console to pull the changes from Github to Glitch. If you're a member of the Glitch Github organization, my-remote will be `origin`. If not, you'll have to add a remote in your remix pointing to your fork of the project and use that.

## Ready to deploy?
Head over to [DEPLOYING.MD](https://glitch.com/edit/#!/community?path=DEPLOYING.md:1:0)