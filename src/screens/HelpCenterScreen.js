import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView, 
  StyleSheet, 
  SafeAreaView,
  Linking 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const HelpCenterScreen = ({ navigation }) => {
  const [expandedFAQ, setExpandedFAQ] = useState(null);

  const faqData = [
    {
      id: 1,
      question: "How do I track my order?",
      answer: "You can track your order by going to 'Order History' in your profile, selecting your order, and clicking 'Track Order'. You'll see real-time updates on your package location."
    },
    {
      id: 2,
      question: "What payment methods do you accept?",
      answer: "We accept major credit/debit cards, mobile payments, and cash on delivery. All transactions are secured with SSL encryption."
    },
    {
      id: 3,
      question: "How long does delivery take?",
      answer: "Standard delivery takes 2-5 business days within Colombo area, and 3-7 days for other areas in Sri Lanka. Express delivery is available for faster shipping."
    },
    {
      id: 4,
      question: "Can I return or exchange items?",
      answer: "Yes, you can return items within 7 days of delivery. Items must be in original condition with tags. Contact our support team to initiate a return."
    },
    {
      id: 5,
      question: "How do I cancel my order?",
      answer: "You can cancel your order within 2 hours of placing it if it's still in 'processing' status. Go to Order History and select 'Cancel Order'."
    },
    {
      id: 6,
      question: "Is my personal information secure?",
      answer: "Yes, we use industry-standard encryption to protect your data. We never share your personal information with third parties without your consent."
    }
  ];

  const quickActions = [
    {
      id: 1,
      title: "Order Issues",
      description: "Problems with delivery, damaged items",
      icon: "cube-outline",
      action: () => navigation.navigate('ChatWithUsScreen')
    },
    {
      id: 2,
      title: "Account Help",
      description: "Login, password, profile issues",
      icon: "person-circle-outline",
      action: () => navigation.navigate('ChatWithUsScreen')
    },
    {
      id: 3,
      title: "Payment Problems",
      description: "Billing, refunds, payment methods",
      icon: "card-outline",
      action: () => navigation.navigate('ChatWithUsScreen')
    },
    {
      id: 4,
      title: "Technical Support",
      description: "App crashes, bugs, performance",
      icon: "settings-outline",
      action: () => navigation.navigate('ChatWithUsScreen')
    }
  ];

  const contactMethods = [
    {
      title: "Call Us",
      subtitle: "+94 11 234 5678",
      icon: "call-outline",
      action: () => Linking.openURL('tel:+94112345678')
    },
    {
      title: "Email Support",
      subtitle: "support@digimarket.lk",
      icon: "mail-outline",
      action: () => Linking.openURL('mailto:support@digimarket.lk')
    },
    {
      title: "Live Chat",
      subtitle: "Available 24/7",
      icon: "chatbubble-outline",
      action: () => navigation.navigate('ChatWithUsScreen')
    }
  ];

  const toggleFAQ = (faqId) => {
    setExpandedFAQ(expandedFAQ === faqId ? null : faqId);
  };

  const renderQuickAction = (action) => (
    <TouchableOpacity 
      key={action.id}
      style={styles.quickActionCard}
      onPress={action.action}
    >
      <Ionicons name={action.icon} size={24} color="#8B5CF6" />
      <View style={styles.quickActionContent}>
        <Text style={styles.quickActionTitle}>{action.title}</Text>
        <Text style={styles.quickActionDescription}>{action.description}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#ccc" />
    </TouchableOpacity>
  );

  const renderFAQ = (faq) => (
    <View key={faq.id} style={styles.faqCard}>
      <TouchableOpacity 
        style={styles.faqHeader}
        onPress={() => toggleFAQ(faq.id)}
      >
        <Text style={styles.faqQuestion}>{faq.question}</Text>
        <Ionicons 
          name={expandedFAQ === faq.id ? "chevron-up" : "chevron-down"} 
          size={20} 
          color="#666" 
        />
      </TouchableOpacity>
      {expandedFAQ === faq.id && (
        <Text style={styles.faqAnswer}>{faq.answer}</Text>
      )}
    </View>
  );

  const renderContactMethod = (method, index) => (
    <TouchableOpacity 
      key={index}
      style={styles.contactCard}
      onPress={method.action}
    >
      <Ionicons name={method.icon} size={24} color="#10B981" />
      <View style={styles.contactContent}>
        <Text style={styles.contactTitle}>{method.title}</Text>
        <Text style={styles.contactSubtitle}>{method.subtitle}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#ccc" />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Help Center</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        
        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>How can we help you?</Text>
          {quickActions.map(renderQuickAction)}
        </View>

        {/* Contact Methods */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Get in Touch</Text>
          {contactMethods.map(renderContactMethod)}
        </View>

        {/* FAQ Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
          {faqData.map(renderFAQ)}
        </View>

        {/* Additional Help */}
        <View style={styles.section}>
          <View style={styles.additionalHelpCard}>
            <Text style={styles.additionalHelpTitle}>Still need help?</Text>
            <Text style={styles.additionalHelpDescription}>
              Our support team is here to help you 24/7. Contact us through any of the methods above.
            </Text>
            <TouchableOpacity 
              style={styles.chatButton}
              onPress={() => navigation.navigate('ChatWithUsScreen')}
            >
              <Text style={styles.chatButtonText}>Start Live Chat</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  section: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  quickActionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  quickActionContent: {
    flex: 1,
    marginLeft: 12,
  },
  quickActionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  quickActionDescription: {
    fontSize: 12,
    color: '#6B7280',
  },
  contactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  contactContent: {
    flex: 1,
    marginLeft: 12,
  },
  contactTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  contactSubtitle: {
    fontSize: 12,
    color: '#10B981',
  },
  faqCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  faqHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  faqQuestion: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  faqAnswer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 18,
  },
  additionalHelpCard: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    marginBottom: 20,
  },
  additionalHelpTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  additionalHelpDescription: {
    fontSize: 13,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 18,
  },
  chatButton: {
    backgroundColor: '#8B5CF6',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  chatButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default HelpCenterScreen;