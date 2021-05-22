const mongoose = require("mongoose");
const Product = require("./models/product");

const arr = [
	{
		title: "Apple Iphone XR",
		img: "iphoneXR.jpg",
		price: 40999,
		desc: "Apple iPhone XR smartphone was launched in September 2018. The phone comes with a 6.10-inch touchscreen display with a resolution of 828x1792 pixels at a pixel density of 326 pixels per inch (ppi) and an aspect ratio of 19.5:9. Apple iPhone XR is powered by a hexa-core Apple A12 Bionic processor. It comes with 3GB of RAM. The Apple iPhone XR runs iOS 12 and is powered by a 2942mAh non-removable battery. The Apple iPhone XR supports wireless charging, as well as proprietary fast charging.<br>As far as the cameras are concerned, the Apple iPhone XR on the rear packs a 12-megapixel camera with an f/1.8 aperture. The rear camera setup has autofocus. It sports a 7-megapixel camera on the front for selfies with an f/2.2 aperture.",
	},
	{
		title: "Apple Macbook Pro",
		img: "macbookPro.jpg",
		price: 116790,
		desc: "Apple MacBook Pro 13-inch 2020 is a macOS laptop with a 13.30-inch display that has a resolution of 1600x2560 pixels. It is powered by a Core i5 processor and it comes with 8GB of RAM. The Apple MacBook Pro 13-inch 2020 packs 256GB of SSD storage.<br>Graphics are powered by Intel Integrated Iris Plus Graphics 645. Connectivity options include Wi-Fi 802.11 a/b/g/n/ac, Bluetooth and it comes with 2 USB ports (2 x Thunderbolt 3 (Type C)), Headphone and Mic Combo Jack ports.",
	},
	{
		title: "OnePlus Watch",
		img: "oneplusWatch.jpg",
		price: 5999,
		desc: "OnePlus Watch is the company's first smartwatch, and it was launched alongside the new OnePlus 9 series last month. The OnePlus Watch has a circular dial and offers features such as SpO2 oxygen saturation tracking, heart-rate tracking, and fast charging. It also claims to offer a week's worth of battery life even for the most active users.<br>The OnePlus Watch has a circular dial. It has a 1.39-inch AMOLED display with 2.5D curved glass on top. The case of the OnePlus Watch measures 46mm and is made out of stainless steel. OnePlus offers this watch in two colour options, Midnight Black and Moonlight Silver. The company has chosen to go with its own operating system, not Google's Wear OS. The OnePlus Watch, aka the OnePlus Watch Classic, has two buttons on the right side of the case. The upper one brings up the apps on the watch, while the lower one is a shortcut key that can be reassigned. The OnePlus Watch has a microphone hole at the bottom of the case (6 o'clock position) while the speaker is on the left. Given the hardware, you should be able to take calls on the OnePlus Watch directly.",
	},
	{
		title: "JBL T450BT Wireless Bluetooth Headphone",
		img: "jblHeadphone.jpg",
		price: 4690,
		desc: "Introducing JBL T450BT on-ear wireless headphones. They’re flat-folding, lightweight, comfortable and compact. Under the hood, a pair of 32mm drivers punch out some serious bass, reproducing the powerful JBL Pure Bass sound you’ve experienced in much bigger venues. Music and call controls/microphone are placed on the earcup. And because your music should go where you go, you’ll get up to 11 hours of uninterrupted audio playback on a single charge.",
	},
	{
		title: "Sony A7C Mirrorless Camera",
		img: "sonyrx100.jpg",
		price: 196990,
		desc: "Sony's slimmest and lightest full-frame mirrorless camera, the Sony A7C, has the guts of a Sony A7 III but in a body that more closely resembles its A6XXX series APS-C mirrorless cameras. The Sony A7C is designed to offer users improved tracking and eye autofocus, plus a fully articulating touchscreen, in an even smaller footprint. It's time to test this camera and see if it's any good.<br>The Sony A7C uses a 24-megapixel full-frame sensor with 693 on-sensor PDAF points and 425 contrast detection AF points. The BionzX image processor is capable of capturing up to 10fps burst shots with AF/AE tracking, real-time tracking focus with the dedicated AF-On button, and real-time Eye AF for humans and animals. The camera has a native ISO range of 100 – 51,200, which is expandable.",
	},
	{
		title: "Philips Trimmer",
		img: "philipsTrimmer.jpg",
		price: 1650,
		desc: "When you want to look your very best, Philips has the right grooming solution for you. Philips combines technology with design & the trimmers last up to 4 x longer v/s ordinary trimmers. The Philips beard trimmer delivers an effortless, even result time after time. Self-sharpening blades are long lasting and stay as sharp as on day one , while rounded tips and combs are gentle on your skin preventing irritation. Please follow the product literature provided with the product.",
	},
	{
		title: "DJI Osmo Pocket",
		img: "djiosmo.jpg",
		price: 11500,
		desc: "The DJI Osmo Pocket Gimbal is a lightweight gimbal stabilizer and 4K camera combination that is compact enough to carry wherever you go. Weighing just over four ounces and measuring only 4.8\" high, this all-in-one unit features 3-axis stabilization to smooth out your movements. The Osmo Pocket incorporates a 1/2.3\" sensor and a wide f/2.0, 80° angle-of-view lens to record up to 4K60 cinematic video and 12MP still photos on up to a 256GB microSD card.<br>The Osmo Pocket's passive cooling system quietly dissipates heat, and a rechargeable battery enables the camera to record up to 140 minutes of 1080p video. Accessories like ND filters, a retractable extension stick, a waterproof case, and an accessory mount are available separately to round out your Osmo Pocket experience.",
	},
];

async function seedDB() {
	await Product.insertMany(arr);
	console.log("Database Seeded!");
}

module.exports = seedDB;
