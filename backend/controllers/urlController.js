const { nanoid } = require("nanoid");
const Url = require("../models/Url");

const isValidHttpUrl = (value) => {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
};

const isValidAlias = (value) => /^[a-zA-Z0-9_-]{4,20}$/.test(value);

exports.createShortUrl = async (req, res) => {
  try {
    const { originalUrl, customAlias, expiresInDays } = req.body;

    if (!originalUrl || !isValidHttpUrl(originalUrl)) {
      return res.status(400).json({ message: "Please provide a valid URL" });
    }

    let shortCode = nanoid(7);
    let customAliasFlag = false;

    if (customAlias) {
      if (!isValidAlias(customAlias)) {
        return res.status(400).json({
          message:
            "Custom alias must be 4-20 chars and only use letters, numbers, _ or -",
        });
      }

      const aliasInUse = await Url.findOne({ shortCode: customAlias }).lean();
      if (aliasInUse) {
        return res.status(409).json({ message: "This custom alias is already taken" });
      }

      shortCode = customAlias;
      customAliasFlag = true;
    }

    let expiresAt = null;
    if (expiresInDays !== undefined && expiresInDays !== null && expiresInDays !== "") {
      const days = Number(expiresInDays);
      if (!Number.isInteger(days) || days < 1 || days > 365) {
        return res
          .status(400)
          .json({ message: "Expiry must be an integer between 1 and 365 days" });
      }
      expiresAt = new Date(Date.now() + days * 24 * 60 * 60 * 1000);
    }

    const shouldReuseExisting = !customAlias && !expiresAt;
    const existing = shouldReuseExisting ? await Url.findOne({ originalUrl }).lean() : null;
    if (existing) {
      return res.status(200).json({
        shortUrl: `${process.env.BASE_URL}/${existing.shortCode}`,
        shortCode: existing.shortCode,
        originalUrl: existing.originalUrl,
        clicks: existing.clicks,
        customAlias: existing.customAlias,
        expiresAt: existing.expiresAt,
      });
    }

    const created = await Url.create({
      originalUrl,
      shortCode,
      customAlias: customAliasFlag,
      expiresAt,
    });

    return res.status(201).json({
      shortUrl: `${process.env.BASE_URL}/${created.shortCode}`,
      shortCode: created.shortCode,
      originalUrl: created.originalUrl,
      clicks: created.clicks,
      customAlias: created.customAlias,
      expiresAt: created.expiresAt,
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

exports.redirectToOriginal = async (req, res) => {
  try {
    const { code } = req.params;
    const urlDoc = await Url.findOne({ shortCode: code });

    if (!urlDoc) {
      return res.status(404).send("Short URL not found");
    }

    if (urlDoc.expiresAt && new Date() > urlDoc.expiresAt) {
      return res.status(410).send("This short URL has expired");
    }

    urlDoc.clicks += 1;
    await urlDoc.save();

    return res.redirect(urlDoc.originalUrl);
  } catch (error) {
    return res.status(500).send("Server error");
  }
};

exports.getRecentLinks = async (_req, res) => {
  try {
    const links = await Url.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    const response = links.map((item) => ({
      id: item._id,
      originalUrl: item.originalUrl,
      shortCode: item.shortCode,
      shortUrl: `${process.env.BASE_URL}/${item.shortCode}`,
      clicks: item.clicks,
      createdAt: item.createdAt,
      customAlias: item.customAlias,
      expiresAt: item.expiresAt,
      isExpired: item.expiresAt ? new Date() > new Date(item.expiresAt) : false,
    }));

    return res.json(response);
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};
