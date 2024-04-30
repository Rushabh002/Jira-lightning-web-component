public with sharing class LabelController {
    public LabelController() {
    }

    @AuraEnabled(cacheable=true)
    public static List<String> fetchLabelOptions() {
        List<String> labelOptions = new List<String>();

        try {
            List<Label__c> labels = [SELECT Id, LabelName__c FROM Label__c];

            for (Label__c label : labels) {
                labelOptions.add(label.LabelName__c);
            }
        } catch (Exception e) {
            System.debug('Error fetching assignee options: ' + e.getMessage());
        }

        return labelOptions;
    }

    @AuraEnabled
    public static String createNewLabelValue(String labelName) {
        System.debug('newLabel ------------------' + labelName);
        try {
            
                Label__c newLabel = new Label__c(LabelName__c = labelName);
                System.debug(newLabel);
                insert newLabel;
                return newLabel.LabelName__c;
        } catch (Exception e) {
            System.debug('Error creating new label: ' + e.getMessage());
            return null;
        }
    }
}