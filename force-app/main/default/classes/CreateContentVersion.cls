public with sharing class CreateContentVersion {
    public CreateContentVersion() {

    }
    @AuraEnabled
    public static void createContentVersion(String title, String pathOnClient, String versionData, Id parentId) {
        ContentVersion cv = new ContentVersion();
        cv.Title = title;
        cv.PathOnClient = pathOnClient;
        cv.VersionData = EncodingUtil.base64Decode(versionData);
        cv.FirstPublishLocationId = parentId;
        insert cv;
    }

}