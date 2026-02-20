class Payment {
  final String id;
  final String label;
  final double amount;
  final double paidAmount;
  final DateTime dueDate;
  final String status; // paid, partial, unpaid
  final String type; // inscription, mensualite, cantine, transport

  Payment({
    required this.id,
    required this.label,
    required this.amount,
    required this.paidAmount,
    required this.dueDate,
    required this.status,
    required this.type,
  });

  factory Payment.fromJson(Map<String, dynamic> json) {
    return Payment(
      id: json['id'] as String,
      label: json['label'] as String,
      amount: (json['amount'] as num).toDouble(),
      paidAmount: (json['paidAmount'] as num).toDouble(),
      dueDate: DateTime.parse(json['dueDate'] as String),
      status: json['status'] as String,
      type: json['type'] as String,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'label': label,
      'amount': amount,
      'paidAmount': paidAmount,
      'dueDate': dueDate.toIso8601String(),
      'status': status,
      'type': type,
    };
  }

  double get remainingAmount => amount - paidAmount;
  double get percentagePaid => (paidAmount / amount) * 100;
  bool get isFullyPaid => status == 'paid';
  bool get isOverdue => !isFullyPaid && DateTime.now().isAfter(dueDate);
}