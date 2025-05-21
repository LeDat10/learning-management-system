const urlToFile = async (url, filename = "image.png") => {
    const response = await fetch(url);
    const blob = await response.blob();
    return new File([blob], filename, { type: blob.type });
};

export const processThumbnail = async (thumbnailUrl) => {
    if (!thumbnailUrl) return [];

    const file = await urlToFile(thumbnailUrl);

    return [
        {
            uid: "-1",
            name: file.name,
            status: "done",
            url: thumbnailUrl,
            originFileObj: file,
        },
    ];
};