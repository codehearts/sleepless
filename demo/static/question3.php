<?php require_once 'framework.php'; ?>
<?php get_header('Swedish | Now Studying | Sleepless Demo', '', 'study-page'); ?>
	<section id="front" class="card one-sided-card">
		<div class="card-front fade-in">
			<span class="card-field">Vilken färg är din nya datorn?</span>
		</div>
	</section>
	<section id="back">
		<form method="post" action="answer3.php" class="is-muted">
			<button type="submit" class="btn mega-btn" id="show-answer" name="show-answer">Show Answer</button>
		</form>
	</section>
<?php get_footer('study'); ?>