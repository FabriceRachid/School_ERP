import 'package:flutter_test/flutter_test.dart';
import 'package:smart_family_connect/main.dart';

void main() {
  testWidgets('App renders login shell', (WidgetTester tester) async {
    await tester.pumpWidget(const SmartFamilyConnectApp());
    expect(find.textContaining('EduPortal'), findsWidgets);
  });
}
