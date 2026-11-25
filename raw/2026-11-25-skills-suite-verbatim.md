# The Freehold Skills Suite: Verbatim Capture

**Date:** 2026-11-25
**Context:** Sent the same day as the grades ladder and PWA captures, after noticing Freehold Ledger only covers the desktop rung. A short typed question followed by a longer dictated message. Captured verbatim so the original thinking is preserved. Polished version lives in [../PHILOSOPHY.md](../PHILOSOPHY.md).

---

What abou the way to make this hbu and spoke as descrbied? like they shoud lbe able to teltl eh agent I want this to hav esyncing or I wna tot setp this up ano nteh clodu adn hten we hsoudl b ealb eot setup this ourselve.s Mayb ew eneed to makeour own freeholders skill repo or somehting?

Right now, Freehold Ledgers seems to just have the local Mac app, but for some reason it misses the idea of having the progressive web app and the hub and spoke thing as well, so I'm not exactly sure. I don't want this all contained in just Freehold Ledgers. A lot of the skills and know-how should be utilized elsewhere.

So, but maybe this is also just a separate project, maybe not. But I'm imagining a set of skills with HTML and Markdown or whatever, which update allow agents to understand what Freehold is and its standard, and then also, just like when it comes to building, this is a freeholders, a freehold builder skill where it can give guidance on how to do that, or deployment and stuff like that, and so all of the freeholders app update have access to the skills.

So it knows to reference these skills when it comes to building it, and it updates. Follow that. Again, the idea is to probably use the most common web services that are available, like AWS, Google Cloud, Microsoft Azure, Cloudflare, other stuff. I don't know. But the idea is that it would just walk through with those questions, or it needs to gather that information, and then it can do that, and then from there, of course, with the consent of the users, that it can download the relevant CLIs, and then it updates instruct the user step by step using, with not being lazy, but giving the URLs to go to, giving specific instructions, giving specific commands that they can run and stuff like that, and easily copy and paste, while also prioritizing security, but being able to do all of these things based off of that.

And so some of that is for each of these ones, mapping them to the relevant CLI. And then also, we don't have to have the whole story about it, but also having the know-how that it needs to go and check the doc- the relevant documentation for the latest versions and do that. It also needs to have a security part about being secure and all this other stuff that I don't really know about, but prioritize protecting keys and things like that.

And yeah, so it should start and be helpful from the beginning, asking if it has an account, finding the relevant thing, helping them walk through or setting it up themselves to execute and install all of this stuff. And then, the agent should be able to do as much as it can through these CLLI/MCP connectors. I guess the most trustworthy one would be to use a plugin on the app that they're using if it's possible, but otherwise, I don't know. I don't know. Maybe we should just use the CLI as the most trustworthy one. But the idea is that it would have the most stuff, and so if it needs to go in a perfect world, it would set up everything itself or somebody would have some type of login so all they would have to do is log in to get the off token, but in places where you have to have an API key, it needs to instruct them about how to give you the right access for the API key, and it needs to be specific and narrow, like if it's an API key that's created, it needs to be restricted to only things that are relevant for setting up the software as it stands.

So I'd like stuff like that. I want to build out a whole skills suite so all of the freeholder ones can reference that when it comes to the actual infrastructure and building and deployment of that.
